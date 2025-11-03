/**
 * E2EE Service
 * Manages encryption keys and provides high-level encryption/decryption
 */

import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  encryptMessage,
  decryptMessage,
  deriveSharedKey,
  encryptPrivateKey,
  decryptPrivateKey,
  formatEncryptedMessage,
  parseEncryptedMessage,
  isEncryptedMessage,
  type EncryptedMessage,
} from '../utils/e2ee';

const STORAGE_KEYS = {
  KEY_PAIR: 'e2ee_key_pair',
  SHARED_KEYS: 'e2ee_shared_keys', // Map of userId -> shared key
  PEER_PUBLIC_KEYS: 'e2ee_peer_keys', // Map of userId -> peer public key
};

interface StoredKeyPair {
  publicKey: string;
  encryptedPrivateKey: string;
}

class E2EEService {
  private keyPair: CryptoKeyPair | null = null;
  private sharedKeys: Map<string, CryptoKey> = new Map();
  private userPassword: string | null = null;

  /**
   * Initialize E2EE - generate or load key pair
   */
  async initialize(password: string): Promise<void> {
    this.userPassword = password;
    
    // Check if key pair exists in storage
    const stored = localStorage.getItem(STORAGE_KEYS.KEY_PAIR);
    
    if (stored) {
      try {
        const keyData: StoredKeyPair = JSON.parse(stored);
        const privateKeyData = await decryptPrivateKey(
          keyData.encryptedPrivateKey,
          password
        );
        
        this.keyPair = {
          publicKey: await importPublicKey(keyData.publicKey),
          privateKey: await importPrivateKey(privateKeyData),
        };
        
        // Load shared keys
        this.loadSharedKeys();
      } catch (error) {
        console.error('Failed to load existing keys, generating new ones:', error);
        await this.generateNewKeyPair(password);
      }
    } else {
      await this.generateNewKeyPair(password);
    }
  }

  /**
   * Generate new key pair
   */
  private async generateNewKeyPair(password: string): Promise<void> {
    this.keyPair = await generateKeyPair();
    
    const publicKeyData = await exportPublicKey(this.keyPair.publicKey);
    const privateKeyData = await exportPrivateKey(this.keyPair.privateKey);
    const encryptedPrivateKey = await encryptPrivateKey(privateKeyData, password);
    
    const stored: StoredKeyPair = {
      publicKey: publicKeyData,
      encryptedPrivateKey,
    };
    
    localStorage.setItem(STORAGE_KEYS.KEY_PAIR, JSON.stringify(stored));
  }

  /**
   * Get user's public key
   */
  async getPublicKey(): Promise<string | null> {
    if (!this.keyPair) {
      throw new Error('E2EE not initialized. Call initialize() first.');
    }
    
    return await exportPublicKey(this.keyPair.publicKey);
  }

  /**
   * Exchange keys with another user and derive shared secret
   */
  async exchangeKeys(userId: string, peerPublicKeyData: string): Promise<void> {
    if (!this.keyPair) {
      throw new Error('E2EE not initialized. Call initialize() first.');
    }
    
    try {
      const peerPublicKey = await importPublicKey(peerPublicKeyData);
      const sharedKey = await deriveSharedKey(this.keyPair.privateKey, peerPublicKey);
      
      this.sharedKeys.set(userId, sharedKey);
      
      // Store peer's public key
      const peerKeys = this.getPeerKeys();
      peerKeys[userId] = peerPublicKeyData;
      localStorage.setItem(STORAGE_KEYS.PEER_PUBLIC_KEYS, JSON.stringify(peerKeys));
      
      // Save shared keys
      this.saveSharedKeys();
    } catch (error) {
      console.error('Key exchange failed:', error);
      throw new Error('Failed to exchange keys');
    }
  }

  /**
   * Get shared key for a user (derive if not exists)
   */
  private async getSharedKeyForUser(userId: string): Promise<CryptoKey | null> {
    // Check cache
    if (this.sharedKeys.has(userId)) {
      return this.sharedKeys.get(userId)!;
    }
    
    // Try to load from storage
    const stored = localStorage.getItem(STORAGE_KEYS.SHARED_KEYS);
    if (stored) {
      const keys = JSON.parse(stored);
      // Note: We can't store CryptoKey directly, so we'll need to re-derive
      // This is a limitation - in production, you might want a different approach
    }
    
    // Check if we have peer's public key
    const peerKeys = this.getPeerKeys();
    if (peerKeys[userId] && this.keyPair) {
      await this.exchangeKeys(userId, peerKeys[userId]);
      return this.sharedKeys.get(userId) || null;
    }
    
    return null;
  }

  /**
   * Encrypt a message for a specific user
   */
  async encryptForUser(userId: string, message: string): Promise<string> {
    const sharedKey = await this.getSharedKeyForUser(userId);
    
    if (!sharedKey) {
      throw new Error(`No shared key found for user ${userId}. Exchange keys first.`);
    }
    
    const encrypted = await encryptMessage(message, sharedKey);
    return formatEncryptedMessage(encrypted);
  }

  /**
   * Decrypt a message from a specific user
   */
  async decryptFromUser(userId: string, encryptedData: string): Promise<string> {
    if (!isEncryptedMessage(encryptedData)) {
      // Message is not encrypted, return as-is (backward compatibility)
      return encryptedData;
    }
    
    const sharedKey = await this.getSharedKeyForUser(userId);
    
    if (!sharedKey) {
      throw new Error(`No shared key found for user ${userId}. Exchange keys first.`);
    }
    
    const encrypted = parseEncryptedMessage(encryptedData);
    return await decryptMessage(encrypted, sharedKey);
  }

  /**
   * Load shared keys from storage
   */
  private loadSharedKeys(): void {
    // Shared keys need to be re-derived on each session for security
    // We only store peer public keys
  }

  /**
   * Save shared keys to storage
   */
  private saveSharedKeys(): void {
    // We don't persist shared keys for security
    // They're re-derived on each session
  }

  /**
   * Get stored peer public keys
   */
  private getPeerKeys(): Record<string, string> {
    const stored = localStorage.getItem(STORAGE_KEYS.PEER_PUBLIC_KEYS);
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Check if E2EE is enabled and initialized
   */
  isInitialized(): boolean {
    return this.keyPair !== null;
  }

  /**
   * Clear all stored keys (logout)
   */
  clearKeys(): void {
    this.keyPair = null;
    this.sharedKeys.clear();
    this.userPassword = null;
    localStorage.removeItem(STORAGE_KEYS.KEY_PAIR);
    localStorage.removeItem(STORAGE_KEYS.SHARED_KEYS);
    localStorage.removeItem(STORAGE_KEYS.PEER_PUBLIC_KEYS);
  }
}

// Singleton instance
export const e2eeService = new E2EEService();

