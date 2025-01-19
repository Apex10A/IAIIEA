// components/providers/toast-provider.tsx

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #E2E8F0',
        },
        className: 'border border-gray-200 dark:border-gray-800',
      }}
      richColors
      closeButton
    />
  );
}