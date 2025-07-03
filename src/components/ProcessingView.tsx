import React from 'react';

const ProcessingView: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-card-bg/95 backdrop-blur-xl flex items-center justify-center rounded-2xl z-50">
      <div className="text-center p-8 bg-card-bg/90 rounded-2xl border border-doc-primary/30 shadow-2xl max-w-md mx-4">
        {/* Enhanced neon loading spinner */}
        <div className="relative mx-auto mb-8">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-doc-primary/30 border-t-doc-primary mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-r-doc-secondary" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-2 animate-ping rounded-full h-16 w-16 bg-doc-primary/20"></div>
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-4 animate-pulse">
          🔮 Analyzing your document...
        </h3>
        <p className="text-lg text-foreground/80 font-medium mb-2">
          AI is working its magic ✨
        </p>
        <p className="text-sm text-foreground/60">
          This may take a few moments
        </p>
        
        {/* Progress dots animation */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-doc-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-doc-secondary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-doc-accent rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;