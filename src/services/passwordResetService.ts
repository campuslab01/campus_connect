import api from '../config/axios';

// Request OTP for password reset
export const requestPasswordOtp = async (email: string) => {
  const res = await api.post('/auth/request-password-otp', { email });
  return res.data;
};

// Verify OTP; backend should return a short-lived session/token to authorize password change
export const verifyPasswordOtp = async (email: string, otp: string) => {
  const res = await api.post('/auth/verify-password-otp', { email, otp });
  return res.data; // Expect { status: 'success', data: { otpSessionId } }
};

// Update password using verified OTP session
export const updatePasswordWithOtp = async (otpSessionId: string, newPassword: string) => {
  const res = await api.put('/auth/update-password-with-otp', { otpSessionId, newPassword });
  return res.data;
};

// Resend OTP
export const resendPasswordOtp = async (email: string) => {
  const res = await api.post('/auth/resend-password-otp', { email });
  return res.data;
};