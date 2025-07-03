import React, { useState } from 'react';
import { Clipboard } from 'lucide-react';

interface ResultsViewProps {
  selectedModel: string;
  onStartOver: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ selectedModel, onStartOver }) => {
  const [copied, setCopied] = useState(false);

  const sampleResults = {
    "invoice": {
      "meta": {
        "id": "r23qpmmjsc7f93o3",
        "status": "Processed"
      },
      "fields": {
        "invoiceNumber": "9435435",
        "invoiceDate": "2021-11-11",
        "total": 4620,
        "currency": "CAD",
        "vendor": {
          "name": "ANADAYA CANADA",
          "address": "262 Merrier Avenue, Toronto, Ontario T1T 3R29"
        }
      }
    }
  };

  const formatModelName = (model: string) => {
    return model.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(sampleResults, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-doc-primary to-doc-secondary bg-clip-text text-transparent mb-3">
          🎉 Extraction Results
        </h2>
        <p className="text-foreground/80 text-lg">
          Processed with: <span className="font-bold text-doc-primary">{formatModelName(selectedModel)} Model</span> ✨
        </p>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">📊 Extracted Data</h3>
          <button
            onClick={handleCopyJSON}
            className={`
              flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105
              ${copied 
                ? 'bg-gradient-to-r from-doc-success to-green-400 text-white animate-pulse' 
                : 'bg-gradient-to-r from-card-bg to-card-border/20 hover:from-doc-primary/20 hover:to-doc-secondary/20 text-foreground border border-card-border'
              }
            `}
          >
            <Clipboard size={18} />
            <span>{copied ? '✅ Copied!' : '📋 Copy JSON'}</span>
          </button>
        </div>

        <div className="bg-code-bg/80 backdrop-blur-sm text-code-text rounded-xl p-6 overflow-x-auto border border-doc-primary/30 relative">
          {/* Subtle neon glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-doc-primary/5 to-doc-secondary/5 rounded-xl"></div>
          <pre className="text-sm font-mono relative z-10 text-doc-accent">
            {JSON.stringify(sampleResults, null, 2)}
          </pre>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onStartOver}
          className="bg-gradient-to-r from-card-bg to-card-border/20 hover:from-doc-primary/20 hover:to-doc-secondary/20 text-foreground px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border border-card-border"
        >
          🔄 Process Another Document
        </button>
      </div>
    </div>
  );
};

export default ResultsView;