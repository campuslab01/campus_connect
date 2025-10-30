import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const iconFor = (type: 'success' | 'error' | 'info') => {
	switch (type) {
		case 'success':
			return <CheckCircle2 className="w-5 h-5 text-emerald-300" />;
		case 'error':
			return <AlertTriangle className="w-5 h-5 text-red-300" />;
		default:
			return <Info className="w-5 h-5 text-blue-300" />;
	}
};

const bgFor = (type: 'success' | 'error' | 'info') => {
	switch (type) {
		case 'success':
			return 'from-emerald-500/20 to-emerald-400/10 border-emerald-400/30';
		case 'error':
			return 'from-red-500/20 to-red-400/10 border-red-400/30';
		default:
			return 'from-blue-500/20 to-purple-500/10 border-blue-400/30';
	}
};

const Toaster: React.FC = () => {
	const { toasts, removeToast } = useToast();
	return (
		<div className="fixed top-4 right-4 z-[1000] space-y-3 w-[90vw] sm:w-[360px]">
			<AnimatePresence>
				{toasts.map((t) => (
					<motion.div
						key={t.id}
						initial={{ opacity: 0, x: 40, scale: 0.95 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: 40, scale: 0.95 }}
						transition={{ type: 'spring', stiffness: 400, damping: 30 }}
						className={`bg-gradient-to-br ${bgFor(t.type)} backdrop-blur-xl border text-white rounded-2xl p-3 shadow-xl flex items-start gap-3`}
					>
						<div className="pt-0.5">{iconFor(t.type)}</div>
						<div className="flex-1">
							{t.title && <div className="text-sm font-semibold leading-tight mb-0.5">{t.title}</div>}
							<div className="text-sm text-white/90">{t.message}</div>
						</div>
						<button onClick={() => removeToast(t.id)} className="text-white/60 hover:text-white transition text-sm">✕</button>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

export default Toaster;
