import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Key, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NaturalLanguageQueryProps {
  extractedData: any;
}

const NaturalLanguageQuery: React.FC<NaturalLanguageQueryProps> = ({ extractedData }) => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsApiKeySet(true);
      toast({
        title: "✅ API Key Saved",
        description: "Your OpenAI API key has been saved securely in browser storage.",
      });
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an intelligent document analysis assistant. You have access to the following extracted document data: ${JSON.stringify(extractedData, null, 2)}. 

              Your task is to:
              1. Answer questions about the document data in plain English
              2. Generate summaries and insights
              3. Create automated reports when requested
              
              Always be accurate, concise, and helpful. If the data doesn't contain information to answer a question, say so clearly.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data.choices[0].message.content);
      
      toast({
        title: "✅ Query Processed",
        description: "Your question has been answered successfully!",
      });
    } catch (error) {
      console.error('Error querying OpenAI:', error);
      toast({
        title: "❌ Query Failed", 
        description: "There was an error processing your question. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async () => {
    setQuery("Please provide a comprehensive summary of this document, highlighting the key information and important details.");
    await handleQuery();
  };

  const generateInsights = async () => {
    setQuery("Analyze this document data and provide insights, patterns, or notable observations that might be valuable for business decisions.");
    await handleQuery();
  };

  if (!isApiKeySet) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-doc-primary to-doc-secondary bg-clip-text text-transparent mb-3 flex items-center gap-2">
            <MessageSquare size={24} />
            🧠 Natural Language Querying
          </h3>
          <p className="text-foreground/80">
            Ask questions about your documents in plain English and get intelligent insights!
          </p>
        </div>

        <div className="bg-card-bg/40 backdrop-blur-xl rounded-xl p-6 border border-card-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Key size={20} className="text-doc-primary" />
            <h4 className="font-bold text-foreground">OpenAI API Key Required</h4>
          </div>
          
          <p className="text-foreground/80 text-sm mb-4">
            To use Natural Language Querying, please enter your OpenAI API key. It will be stored securely in your browser's local storage.
          </p>
          
          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="flex-1 bg-background border border-card-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-doc-primary"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-gradient-to-r from-doc-primary to-doc-secondary text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-doc-primary to-doc-secondary bg-clip-text text-transparent mb-3 flex items-center gap-2">
          <MessageSquare size={24} />
          🧠 Natural Language Querying
        </h3>
        <p className="text-foreground/80">
          Ask questions about your documents in plain English and get intelligent insights!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={generateSummary}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-doc-primary/20 to-doc-secondary/20 hover:from-doc-primary/30 hover:to-doc-secondary/30 text-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-doc-primary/30"
        >
          <Sparkles size={16} />
          Generate Summary
        </button>
        
        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-doc-secondary/20 to-doc-accent/20 hover:from-doc-secondary/30 hover:to-doc-accent/30 text-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-doc-secondary/30"
        >
          <Sparkles size={16} />
          Generate Insights
        </button>
      </div>

      {/* Query Input */}
      <div className="bg-card-bg/40 backdrop-blur-xl rounded-xl p-6 border border-card-border/50">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your document... e.g., 'What is the total amount?' or 'Who is the vendor?'"
            className="flex-1 bg-background border border-card-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-doc-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />
          <button
            onClick={handleQuery}
            disabled={isLoading || !query.trim()}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300
              ${isLoading || !query.trim()
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-doc-primary to-doc-secondary text-white hover:scale-105'
              }
            `}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isLoading ? 'Processing...' : 'Ask'}
          </button>
        </div>

        {/* Response */}
        {response && (
          <div className="bg-background/50 border border-doc-primary/20 rounded-lg p-4">
            <h5 className="font-bold text-doc-primary mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              AI Response:
            </h5>
            <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalLanguageQuery;