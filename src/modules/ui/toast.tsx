import React, { useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  
  // Automatically close the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Calls the onClose function to close the toast
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 w-[550px] max-w-[40%] right-4 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <div className='flex items-start justify-between'>
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 text-lg font-bold">
          &times; {/* "X" symbol */}
        </button>
      </div>
    </div>
  );
};

export default Toast;
