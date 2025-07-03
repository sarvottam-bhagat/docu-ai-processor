import React, { useState } from 'react';
import { Clipboard, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NaturalLanguageQuery from './NaturalLanguageQuery';

interface ResultsViewProps {
  selectedModel: string;
  onStartOver: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ selectedModel, onStartOver }) => {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

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

  const handleSendData = async () => {
    setSending(true);
    
    try {
      const response = await fetch('https://sarvottam08.app.n8n.cloud/webhook-test/b0165af1-4fb1-43c0-8513-7ef7d871156c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...sampleResults,
          timestamp: new Date().toISOString(),
          model: selectedModel,
          source: 'intelligent-document-processing'
        }),
      });

      toast({
        title: "✅ Data Sent Successfully!",
        description: "Your extracted data has been sent to n8n workflow.",
      });
    } catch (error) {
      console.error('Error sending data:', error);
      toast({
        title: "❌ Failed to Send Data",
        description: "There was an error sending data to n8n. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
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

      {/* Natural Language Querying Section */}
      <div className="border-t border-card-border/30 pt-8">
        <NaturalLanguageQuery extractedData={sampleResults} />
      </div>

      <div className="flex justify-center gap-6 pt-6">
        <button
          onClick={handleSendData}
          disabled={sending}
          className={`
            flex items-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105
            ${sending 
              ? 'bg-gradient-to-r from-doc-primary/50 to-doc-secondary/50 text-white cursor-not-allowed' 
              : 'bg-gradient-to-r from-doc-primary to-doc-secondary hover:from-doc-primary-hover hover:to-doc-secondary text-white hover:shadow-lg hover:shadow-doc-primary/25'
            }
          `}
        >
          <Send size={20} />
          <span>{sending ? '🚀 Sending...' : '📤 Send Data'}</span>
        </button>
        
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