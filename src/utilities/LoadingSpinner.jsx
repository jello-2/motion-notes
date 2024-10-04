import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-300"></div>
    </div>
  );
};

export default LoadingSpinner;