// utils/toast.ts

import { toast } from 'sonner';

interface ToastOptions {
  duration?: number;
  description?: string;
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      className: 'bg-white dark:bg-gray-800',
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      className: 'bg-white dark:bg-gray-800',
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      className: 'bg-white dark:bg-gray-800',
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      className: 'bg-white dark:bg-gray-800',
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    toast.loading(message, {
      duration: options?.duration || 3000,
      description: options?.description,
      className: 'bg-white dark:bg-gray-800',
    });
  },

  promise: async <T>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
      className: 'bg-white dark:bg-gray-800',
    });
  },
};