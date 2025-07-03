import React from 'react';

const ProcessingView: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doc-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Analyzing your document...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
      </div>
    </div>
  );
};

export default ProcessingView;