import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, XCircle } from 'lucide-react';
import faceService from '../services/faceService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Props {
  onSuccess?: () => void;
}

const FaceVerification: React.FC<Props> = ({ onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ verified: boolean; score: number; liveness: boolean } | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreaming(true);
        }
      } catch (_err) {
        showToast({ type: 'error', message: 'Camera access denied. Please allow camera to verify.', duration: 4000 });
      }
    })();
    return () => {
      const v = videoRef.current as HTMLVideoElement | null;
      const stream = (v?.srcObject as MediaStream) || null;
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [showToast]);

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setCaptured(blob);
    }, 'image/jpeg', 0.9);
  };

  const submit = async () => {
    if (!captured) {
      return showToast({ type: 'error', message: 'Please capture a selfie first', duration: 2500 });
    }
    setLoading(true);
    try {
      const file = new File([captured], 'selfie.jpg', { type: 'image/jpeg' });
      const profileImageUrl = (user as any)?.profileImage || ((user as any)?.photos?.[0]) || undefined;
      const res = await faceService.uploadSelfie(file, profileImageUrl);
      const data = res?.status === 'success' ? res : res;
      const verified = Boolean(data?.verified);
      const score = Number(data?.score || 0);
      const live = Boolean(data?.liveness);
      setResult({ verified, score, liveness: live });
      if (verified && onSuccess) onSuccess();
      showToast({ type: verified ? 'success' : 'error', message: verified ? 'Profile verified!' : 'Verification failed. Try again.', duration: 4000 });
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Verification failed';
      showToast({ type: 'error', message: msg, duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <video ref={videoRef} className="w-full h-64 object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={capture} className="px-4 py-2 rounded-full bg-white/10 text-white inline-flex items-center gap-2">
                <Camera className="w-5 h-5" /> Capture
              </button>
              <button onClick={submit} disabled={loading || !captured} className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {loading ? 'Verifying…' : 'Verify Now'}
              </button>
            </div>
            {captured && (
              <div className="mt-3 text-xs text-white/70">Selfie captured. Click Verify Now.</div>
            )}
          </div>
          <div>
            {result ? (
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {result.verified ? (
                    <CheckCircle2 className="text-green-400" />
                  ) : (
                    <XCircle className="text-red-400" />
                  )}
                  <span className="text-white font-medium">{result.verified ? 'Verified' : 'Not Verified'}</span>
                </div>
                <div className="text-white/80">Similarity score: {result.score}</div>
                <div className="text-white/80">Liveness: {result.liveness ? 'Pass' : 'Fail'}</div>
              </div>
            ) : (
              <div className="text-white/60">Capture a selfie and verify. We check face quality, liveness, and compare with your profile photo.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification;