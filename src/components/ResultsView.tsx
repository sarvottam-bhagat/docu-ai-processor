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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Extraction Results</h2>
        <p className="text-gray-600">
          Processed with: <span className="font-semibold">{formatModelName(selectedModel)} Model</span>
        </p>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Extracted Data</h3>
          <button
            onClick={handleCopyJSON}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${copied 
                ? 'bg-doc-success text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            <Clipboard size={16} />
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>

        <div className="bg-code-bg text-code-text rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono">
            {JSON.stringify(sampleResults, null, 2)}
          </pre>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onStartOver}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Process Another Document
        </button>
      </div>
    </div>
  );
};

export default ResultsView;