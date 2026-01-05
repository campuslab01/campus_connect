import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	title?: string;
	message: string;
	duration?: number; // ms
}

interface ToastContextType {
	toasts: Toast[];
	showToast: (toast: Omit<Toast, 'id'>) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
		const id = Math.random().toString(36).slice(2);
		const next: Toast = { id, duration: 3000, ...toast };
		setToasts((prev) => [next, ...prev]);
		if (next.duration && next.duration > 0) {
			setTimeout(() => removeToast(id), next.duration);
		}
	}, [removeToast]);

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
		</ToastContext.Provider>
	);
};
