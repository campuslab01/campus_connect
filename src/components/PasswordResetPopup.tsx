import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import {
  requestPasswordOtp,
  verifyPasswordOtp,
  updatePasswordWithOtp,
  resendPasswordOtp,
  registerInit,
  verifySignupOtp,
  resendSignupOtp,
} from '../services/passwordResetService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PasswordResetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resetToken?: string;
  mode?: 'forgot' | 'reset' | 'signup';
  prefilledEmail?: string;
  signupData?: any;
}

export const PasswordResetPopup: React.FC<PasswordResetPopupProps> = ({
  isOpen,
  onClose,
  resetToken,
  mode = 'forgot',
  prefilledEmail,
  signupData
}) => {
  const [email, setEmail] = useState(prefilledEmail || '');
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

  // OTP flow state
  const [step, setStep] = useState<'request' | 'otp' | 'change'>(mode === 'reset' ? 'change' : 'request');
  const [otpInputs, setOtpInputs] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    } else if (step === 'otp' && otpTimer === 0) {
      setCanResend(true);
    }
    return () => timer && clearInterval(timer);
  }, [step, otpTimer]);

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
    if (mode === 'signup') {
      try {
        if (!signupData || !signupData.email) {
          throw new Error('Missing signup data');
        }
        setEmail(signupData.email);
        const response = await registerInit(signupData);
        if (response?.status === 'success') {
          showToast({ type: 'success', message: 'OTP sent to your email. Please check your inbox.', duration: 4000 });
          setStep('otp');
          setOtpInputs(['', '', '', '', '', '']);
          setOtpTimer(60);
          setCanResend(false);
        } else {
          throw new Error(response?.message || 'Failed to send OTP');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
        setError(errorMessage);
        showToast({ type: 'error', message: errorMessage, duration: 4000 });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!email) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await requestPasswordOtp(email);
      if (response?.status === 'success') {
        showToast({
          type: 'success',
          message: 'OTP sent to your email. Please check your inbox.',
          duration: 4000,
        });
        setStep('otp');
        setOtpInputs(['', '', '', '', '', '']);
        setOtpTimer(60);
        setCanResend(false);
      } else {
        throw new Error(response?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      showToast({ type: 'error', message: errorMessage, duration: 4000 });
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

    // Complexity: min 8 chars, uppercase, lowercase, number, symbol
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!complexity.test(password)) {
      setError('Password must be 8+ chars with upper, lower, number, and symbol');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      // OTP-based password update
      if (!otpSessionId) {
        throw new Error('Verification session not found. Please verify OTP again.');
      }
      const response = await updatePasswordWithOtp(otpSessionId, password);
      if (response?.status === 'success') {
        setSuccess(true);
        showToast({
          type: 'success',
          message: 'Password reset successfully! Logging you in...',
          duration: 3000
        });
        // Auto-login user
        try {
          const loginResult = await login(email, password);
          
          if (loginResult.success) {
            // Navigate to discover page
            setTimeout(() => {
              navigate('/discover');
              onClose();
            }, 1500);
          } else {
            // Login failed, redirect to auth page
            setTimeout(() => {
              navigate('/auth');
              onClose();
            }, 2000);
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          // Still close popup and show success, but redirect to login
          setTimeout(() => {
            navigate('/auth');
            onClose();
          }, 2000);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password.';
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const otp = otpInputs.join('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const response = await verifySignupOtp(email, otp);
        if (response?.status === 'success') {
          setSuccess(true);
          showToast({ type: 'success', message: 'Email verified and account created!', duration: 3000 });
          try {
            if (signupData?.password) {
              const loginResult = await login(email, signupData.password);
              if (loginResult.success) {
                setTimeout(() => {
                  navigate('/discover');
                  onClose();
                }, 1500);
              } else {
                setTimeout(() => {
                  navigate('/auth');
                  onClose();
                }, 1500);
              }
            } else {
              setTimeout(() => {
                navigate('/auth');
                onClose();
              }, 1500);
            }
          } catch {
            setTimeout(() => {
              navigate('/auth');
              onClose();
            }, 1500);
          }
          return;
        } else {
          throw new Error(response?.message || 'Invalid OTP');
        }
      }
      const response = await verifyPasswordOtp(email, otp);
      if (response?.status === 'success' && response?.data?.otpSessionId) {
        setOtpSessionId(response.data.otpSessionId);
        showToast({ type: 'success', message: 'OTP verified. You can now change your password.', duration: 3000 });
        setStep('change');
        setError(null);
      } else {
        throw new Error(response?.message || 'Invalid OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid or expired OTP.';
      setError(errorMessage);
      showToast({ type: 'error', message: errorMessage, duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = mode === 'signup' ? await resendSignupOtp(email) : await resendPasswordOtp(email);
      if (response?.status === 'success') {
        showToast({ type: 'success', message: 'OTP resent to your email.', duration: 3000 });
        setOtpInputs(['', '', '', '', '', '']);
        setOtpTimer(60);
        setCanResend(false);
      } else {
        throw new Error(response?.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      showToast({ type: 'error', message: errorMessage, duration: 4000 });
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

  // Legacy reset token flow not used in OTP mode
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
                {mode === 'signup' ? (step === 'request' ? 'Verify Your Email' : step === 'otp' ? 'Enter OTP' : 'Verified') : (
                  step === 'request' ? 'Reset Password' : step === 'otp' ? 'Enter OTP' : 'Set New Password'
                )}
              </h2>
              <p className="text-white/80 text-sm">
                {mode === 'signup' ? (step === 'request' ? 'We\'ll send a verification code to your email' : step === 'otp' ? 'Enter the 6-digit OTP sent to your email' : 'Email verified') : (
                  step === 'request' ? 'Enter your email and we\'ll send an OTP' : step === 'otp' ? 'Enter the 6-digit OTP sent to your email' : 'Enter your new password below'
                )}
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
                    ? 'Password reset successfully!'
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
              <form onSubmit={step === 'request' ? handleForgotPassword : (step === 'otp' ? handleVerifyOtp : handleResetPassword)}>
                {step === 'request' ? (
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
                        disabled={isSubmitting || mode === 'signup'}
                      />
                    </div>
                  </div>
                ) : step === 'otp' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Enter OTP</label>
                      <div className="flex gap-3 justify-center">
                        {otpInputs.map((val, idx) => (
                          <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            onChange={(e) => {
                              const ch = e.target.value.replace(/\D/g, '').slice(0, 1);
                              setOtpInputs((prev) => {
                                const next = [...prev];
                                next[idx] = ch;
                                return next;
                              });
                              // Move focus to next
                              if (ch && idx < 5) {
                                const nextInput = document.querySelector<HTMLInputElement>(`#otp-${idx + 1}`);
                                nextInput?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otpInputs[idx] && idx > 0) {
                                const prevInput = document.querySelector<HTMLInputElement>(`#otp-${idx - 1}`);
                                prevInput?.focus();
                              }
                            }}
                            id={`otp-${idx}`}
                            className="w-12 h-12 text-center text-xl bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                        <span>Time remaining: {otpTimer}s</span>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={!canResend || isSubmitting}
                          className={`underline ${canResend ? 'text-blue-300 hover:text-purple-300' : 'text-white/40 cursor-not-allowed'}`}
                        >
                          Resend OTP
                        </button>
                      </div>
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
                          minLength={8}
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
                          minLength={8}
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
                        {step === 'request' ? 'Sending...' : step === 'otp' ? 'Verifying...' : 'Resetting...'}
                      </span>
                    ) : (
                      step === 'request' ? 'Send OTP' : step === 'otp' ? 'Verify OTP' : 'Reset Password'
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

