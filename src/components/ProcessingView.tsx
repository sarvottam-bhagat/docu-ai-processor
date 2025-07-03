import React from 'react';

const ProcessingView: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-card-bg/90 backdrop-blur-xl flex items-center justify-center rounded-2xl">
      <div className="text-center">
        {/* Neon loading spinner */}
        <div className="relative mx-auto mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-doc-primary/30 border-t-doc-primary"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-r-doc-secondary" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        <p className="text-2xl font-bold text-foreground mb-2 animate-pulse">
          🔮 Analyzing your document...
        </p>
        <p className="text-foreground/70 font-medium">
          AI is working its magic ✨
        </p>
      </div>
    </div>
  );
};

export default ProcessingView;