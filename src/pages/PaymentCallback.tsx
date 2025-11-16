import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../config/axios';
import { useToast } from '../contexts/ToastContext';

const PaymentCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [checking, setChecking] = useState(true);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const status = params.get('status') || '';
        setStatusText(status ? `Payment status: ${status}` : 'Processing payment...');

        const res = await api.get('/payment/premium-status');
        if (res.data?.active) {
          showToast({ type: 'success', message: 'Premium activated! 🎉', duration: 4000 });
          navigate('/likes');
        } else {
          showToast({ type: 'error', message: 'Payment not confirmed yet. Please wait.', duration: 5000 });
        }
      } catch (e: any) {
        showToast({ type: 'error', message: e?.response?.data?.message || 'Payment check failed', duration: 5000 });
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [location.search, navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Payment Callback</h1>
        <p className="text-sm text-gray-700">{statusText}</p>
        {!checking && (
          <button
            className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            onClick={() => navigate('/likes')}
          >
            Go to Likes
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;