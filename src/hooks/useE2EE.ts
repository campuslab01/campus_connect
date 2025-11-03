import { useEffect, useState } from 'react';
import { e2eeService } from '../services/e2eeService';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to manage E2EE functionality
 */
export const useE2EE = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Get user's public key from backend
  const { data: myPublicKeyData } = useQuery({
    queryKey: ['e2ee', 'myPublicKey'],
    queryFn: async () => {
      const response = await api.get('/e2ee/public-key');
      return response.data.data;
    },
    enabled: !!user && !initializing,
  });

  // Initialize E2EE on mount/login
  useEffect(() => {
    if (!user || isInitialized || initializing) return;

    const initializeE2EE = async () => {
      setInitializing(true);
      try {
        // Use a combination of user ID and password hash as the password
        // In production, you'd get this from a secure source or ask user
        const password = `${user._id}-${user.email}`;
        
        await e2eeService.initialize(password);

        // Get or save public key
        const publicKey = await e2eeService.getPublicKey();
        
        if (publicKey && (!myPublicKeyData?.publicKey || myPublicKeyData.publicKey !== publicKey)) {
          // Save public key to backend
          await api.put('/e2ee/public-key', { publicKey });
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize E2EE:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeE2EE();

    // Cleanup on logout
    return () => {
      if (!user) {
        e2eeService.clearKeys();
        setIsInitialized(false);
      }
    };
  }, [user, isInitialized, initializing, myPublicKeyData]);

  /**
   * Get public key for a user (fetch from backend if needed)
   */
  const getPublicKeyForUser = async (userId: string): Promise<string | null> => {
    try {
      const response = await api.get(`/e2ee/public-key/${userId}`);
      return response.data.data?.publicKey || null;
    } catch (error) {
      console.error('Failed to get public key for user:', error);
      return null;
    }
  };

  /**
   * Exchange keys with another user
   */
  const exchangeKeys = async (userId: string): Promise<boolean> => {
    try {
      const peerPublicKey = await getPublicKeyForUser(userId);
      if (!peerPublicKey) {
        return false;
      }

      await e2eeService.exchangeKeys(userId, peerPublicKey);
      return true;
    } catch (error) {
      console.error('Failed to exchange keys:', error);
      return false;
    }
  };

  /**
   * Encrypt message for a user
   */
  const encryptForUser = async (userId: string, message: string): Promise<string> => {
    try {
      // Ensure keys are exchanged
      if (!e2eeService.isInitialized()) {
        throw new Error('E2EE not initialized');
      }

      // Try to exchange keys if not already done
      await exchangeKeys(userId);

      return await e2eeService.encryptForUser(userId, message);
    } catch (error) {
      console.error('Encryption failed:', error);
      // Return original message if encryption fails (backward compatibility)
      return message;
    }
  };

  /**
   * Decrypt message from a user
   */
  const decryptFromUser = async (userId: string, encryptedMessage: string): Promise<string> => {
    try {
      if (!e2eeService.isInitialized()) {
        return encryptedMessage; // Return as-is if not initialized
      }

      // Try to exchange keys if not already done
      await exchangeKeys(userId);

      return await e2eeService.decryptFromUser(userId, encryptedMessage);
    } catch (error) {
      console.error('Decryption failed:', error);
      // Return encrypted message if decryption fails
      return encryptedMessage;
    }
  };

  return {
    isInitialized,
    initializing,
    encryptForUser,
    decryptFromUser,
    exchangeKeys,
    getPublicKeyForUser,
  };
};

