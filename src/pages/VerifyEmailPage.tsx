import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import api from '../config/axios';
import { useToast } from '../contexts/ToastContext';
import bgImage from "/images/login.jpeg";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');

      if (!token || !userId) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email for the correct link.');
        return;
      }

      try {
        const response = await api.get('/auth/verify-email', {
          params: { token, userId }
        });

        if (response.data.status === 'success') {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          showToast({
            type: 'success',
            message: 'Email verified successfully!',
            duration: 3000
          });

          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/auth');
          }, 2000);
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email. The link may have expired.');
        showToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to verify email',
          duration: 4000
        });
      }
    };

    verifyEmail();
  }, [searchParams, navigate, showToast]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>

      <motion.div
        className="relative bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse">
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Email</h2>
            <p className="text-white/80">{message}</p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-500/20 border border-green-500/50">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-white/80">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-500/20 border border-red-500/50">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-white/80 mb-6">{message}</p>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Go to Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;

