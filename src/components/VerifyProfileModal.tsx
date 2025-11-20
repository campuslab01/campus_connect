import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import FaceVerification from './FaceVerification';

interface VerifyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileImageUrl?: string;
  onVerifiedSuccess: () => void;
}

const VerifyProfileModal: React.FC<VerifyProfileModalProps> = ({ isOpen, onClose, profileImageUrl, onVerifiedSuccess }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        showToast({ type: 'error', message: 'Unable to access camera. Check permissions.' });
      }
    };
    if (isOpen) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, showToast]);

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedDataUrl(dataUrl);
    showToast({ type: 'info', message: 'Selfie captured. Ready to verify.' });
  };

  const dataUrlToBlob = async (dataUrl: string) => {
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  const verifyFaces = async (selfieDataUrl: string, profileImage?: string) => {
    try {
      const form = new FormData();
      const selfieBlob = await dataUrlToBlob(selfieDataUrl);
      form.append('selfie', selfieBlob, 'selfie.jpg');
      if (profileImage) form.append('profileImageUrl', profileImage);

      const { data } = await api.post('/verify-face', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const confidence: number = data?.confidence ?? 0;
      const verified: boolean = data?.verified ?? confidence >= 80;
      return verified ? Math.max(confidence, 80) : confidence;
    } catch (e) {
      throw e;
    }
  };

  const handleVerify = async () => {
    if (!capturedDataUrl) {
      showToast({ type: 'info', message: 'Please capture a selfie first.' });
      return;
    }
    if (!profileImageUrl) {
      showToast({ type: 'error', message: 'Profile image not found.' });
      return;
    }
    setIsCapturing(true);
    try {
      const confidence = await verifyFaces(capturedDataUrl, profileImageUrl);
      if (confidence >= 80) {
        onVerifiedSuccess();
        showToast({ type: 'success', message: 'Profile verified successfully!' });
        onClose();
      } else {
        showToast({ type: 'error', message: 'Face mismatch. Try again.' });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err?.message || 'Verification failed.' });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="px-6 py-5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-b border-white/20">
              <h3 className="text-white text-lg font-bold">Verify Your Profile</h3>
              <p className="text-white/80 text-sm mt-1">Take a quick selfie to verify you’re a real person.</p>
            </div>
            <div className="px-6 py-5">
              <FaceVerification onSuccess={onVerifiedSuccess} />
              <div className="mt-3">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerifyProfileModal;