/**
 * Centralized Error Handling Utilities
 * 
 * Provides consistent error handling and user feedback across the application.
 */

import { showToast } from '../contexts/ToastContext';

export interface ErrorInfo {
  message: string;
  statusCode?: number;
  code?: string;
  field?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Parse API error response
 */
export const parseAPIError = (error: any): ErrorInfo => {
  // Axios error structure
  if (error.response) {
    const { status, data } = error.response;
    
    return {
      message: data?.message || data?.error || 'An error occurred',
      statusCode: status,
      code: data?.code,
      field: data?.field,
      errors: data?.errors || (data?.error ? [{ field: 'general', message: data.error }] : []),
    };
  }
  
  // Network error
  if (error.request) {
    return {
      message: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR',
    };
  }
  
  // Other errors
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR',
  };
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: ErrorInfo): string => {
  const { message, statusCode, code } = error;
  
  // Map status codes to friendly messages
  if (statusCode) {
    switch (statusCode) {
      case 400:
        return message || 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return message || 'You do not have permission to perform this action.';
      case 404:
        return message || 'The requested resource was not found.';
      case 409:
        return message || 'This resource already exists.';
      case 422:
        return message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return message || 'An error occurred. Please try again.';
    }
  }
  
  // Map error codes to friendly messages
  if (code) {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'Network error. Please check your internet connection.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      case 'CANCELLED':
        return 'Request was cancelled.';
      default:
        return message || 'An error occurred. Please try again.';
    }
  }
  
  return message || 'An error occurred. Please try again.';
};

/**
 * Handle error and show toast notification
 */
export const handleError = (error: any, customMessage?: string) => {
  const errorInfo = parseAPIError(error);
  const friendlyMessage = customMessage || getUserFriendlyMessage(errorInfo);
  
  // Log error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error('Error details:', {
      original: error,
      parsed: errorInfo,
      friendly: friendlyMessage,
    });
  }
  
  // Show toast notification
  showToast({
    type: 'error',
    message: friendlyMessage,
    duration: 5000,
  });
  
  return errorInfo;
};

/**
 * Handle validation errors (multiple fields)
 */
export const handleValidationErrors = (error: any) => {
  const errorInfo = parseAPIError(error);
  
  if (errorInfo.errors && errorInfo.errors.length > 0) {
    // Show first validation error
    const firstError = errorInfo.errors[0];
    handleError(error, firstError.message);
    
    // Log all validation errors in development
    if (import.meta.env.DEV && errorInfo.errors.length > 1) {
      console.warn('Additional validation errors:', errorInfo.errors.slice(1));
    }
  } else {
    handleError(error);
  }
  
  return errorInfo;
};

/**
 * Handle success with toast notification
 */
export const handleSuccess = (message: string, duration: number = 3000) => {
  showToast({
    type: 'success',
    message,
    duration,
  });
};

/**
 * Handle info with toast notification
 */
export const handleInfo = (message: string, duration: number = 3000) => {
  showToast({
    type: 'info',
    message,
    duration,
  });
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: any): boolean => {
  const errorInfo = parseAPIError(error);
  const { statusCode, code } = errorInfo;
  
  // Retryable status codes (5xx server errors, 429 rate limit)
  if (statusCode && (statusCode >= 500 || statusCode === 429)) {
    return true;
  }
  
  // Retryable error codes
  if (code === 'NETWORK_ERROR' || code === 'TIMEOUT') {
    return true;
  }
  
  return false;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Safe async operation wrapper
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      handleError(error);
    }
    return null;
  }
};

