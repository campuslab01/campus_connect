import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import api from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface PasswordResetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resetToken?: string;
  mode?: 'forgot' | 'reset'; // 'forgot' = request reset, 'reset' = set new password
}

export const PasswordResetPopup: React.FC<PasswordResetPopupProps> = ({
  isOpen,
  onClose,
  resetToken,
  mode = 'forgot'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-open if reset token is provided (for reset mode)
  useEffect(() => {
    if (mode === 'reset' && resetToken && isOpen) {
      // Already open, no action needed
    }
  }, [mode, resetToken, isOpen]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.status === 'success') {
        setSuccess(true);
        showToast({
          type: 'success',
          message: 'Password reset link has been sent to your email',
          duration: 5000
        });
        
        // Close popup after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setEmail('');
          onClose();
        }, 3000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      showToast({
        type: 'error',
        message: errorMessage,
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!resetToken) {
      setError('Reset token is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.put(`/auth/reset-password/${resetToken}`, {
        password
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        showToast({
          type: 'success',
          message: 'Password reset successfully! Logging you in...',
          duration: 3000
        });

        // Auto-login user
        try {
          const loginResponse = await api.post('/auth/login', {
            email: response.data.data.user.email,
            password
          });

          if (loginResponse.data.status === 'success') {
            localStorage.setItem('token', loginResponse.data.data.token);
            localStorage.setItem('tokenTimestamp', Date.now().toString());
            
            // Update auth context
            await login(response.data.data.user.email, password);
            
            // Navigate to discover page
            setTimeout(() => {
              navigate('/discover');
              onClose();
            }, 1500);
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          // Still close popup and show success
          setTimeout(() => {
            navigate('/auth');
            onClose();
          }, 2000);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
      setError(errorMessage);
      showToast({
        type: 'error',
        message: errorMessage,
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (mode === 'reset' && !resetToken) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors disabled:opacity-50"
            >
              <XCircle size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {mode === 'forgot' ? 'Reset Password' : 'Set New Password'}
              </h2>
              <p className="text-white/80 text-sm">
                {mode === 'forgot' 
                  ? 'Enter your email and we\'ll send you a reset link'
                  : 'Enter your new password below'}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <p className="text-green-300 text-sm">
                  {mode === 'forgot'
                    ? 'Reset link sent! Check your email.'
                    : 'Password reset successfully!'}
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && !success && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={mode === 'forgot' ? handleForgotPassword : handleResetPassword}>
                {mode === 'forgot' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                          required
                          disabled={isSubmitting}
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                          required
                          disabled={isSubmitting}
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white/80 font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      isSubmitting
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        {mode === 'forgot' ? 'Sending...' : 'Resetting...'}
                      </span>
                    ) : (
                      mode === 'forgot' ? 'Send Reset Link' : 'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

