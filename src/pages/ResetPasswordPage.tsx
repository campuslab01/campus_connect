import React from 'react';
import { useSearchParams } from 'react-router-dom';
import bgImage from "/images/login.jpeg";
import { PasswordResetPopup } from '../components/PasswordResetPopup';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>
      
      <PasswordResetPopup
        isOpen={true}
        onClose={() => {}}
        resetToken={resetToken || undefined}
        mode="reset"
      />
    </div>
  );
};

export default ResetPasswordPage;

