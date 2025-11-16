import React from 'react';
import { Crown } from 'lucide-react';
import api from '../config/axios';
import { useToast } from '../contexts/ToastContext';

type Plan = 'monthly' | 'quarterly' | 'semiannual';

interface Props {
  plan?: Plan;
  className?: string;
}

const UpgradePremiumButton: React.FC<Props> = ({ plan = 'monthly', className }) => {
  const { showToast } = useToast();

  const onClick = async () => {
    try {
      const amount = plan === 'monthly' ? 99 : plan === 'quarterly' ? 267 : 474;
      const res = await api.post('/payment/create-payment', {
        plan,
        amount,
        redirect_url: window.location.origin + '/payment/callback'
      });
      if (res.data.status !== 'success') {
        throw new Error(res.data.message || 'Failed to create payment');
      }
      window.location.href = res.data.data.longurl;
    } catch (e: any) {
      showToast({
        type: 'error',
        message: e?.response?.data?.message || e.message || 'Payment init failed',
        duration: 5000
      });
    }
  };

  return (
    <button
      onClick={onClick}
      className={
        className ||
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg'
      }
    >
      <Crown className="w-5 h-5" />
      Upgrade to Premium
    </button>
  );
};

export default UpgradePremiumButton;