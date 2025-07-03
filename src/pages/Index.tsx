import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import DocumentAnalysis from '../components/DocumentAnalysis';
import ProcessingView from '../components/ProcessingView';
import ResultsView from '../components/ResultsView';

type AppState = 'initial' | 'file_uploaded' | 'suggestion_received' | 'processing' | 'results_displayed';

const Index = () => {
  const [state, setState] = useState<AppState>('initial');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setState('file_uploaded');
    
    // Simulate AI suggestion after 1.5 seconds
    setTimeout(() => {
      setShowSuggestion(true);
      setState('suggestion_received');
    }, 1500);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  const handleProcess = () => {
    setState('processing');
    
    // Simulate processing time (3 seconds)
    setTimeout(() => {
      setState('results_displayed');
    }, 3000);
  };

  const handleStartOver = () => {
    setState('initial');
    setSelectedFile(null);
    setSelectedModel('');
    setShowSuggestion(false);
  };

  return (
    <div className="min-h-screen bg-background font-inter relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20"></div>
      
      {/* Floating neon orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-doc-primary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-doc-secondary/20 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-doc-accent/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-doc-primary via-doc-secondary to-doc-accent bg-clip-text text-transparent mb-4 animate-glow-pulse">
              Document AI Processor
            </h1>
            <p className="text-xl text-foreground/80 font-medium">
              ✨ Upload your docs and let AI do the magic ✨
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-card-bg/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-card-border/50 p-8 relative overflow-hidden">
            {/* Neon border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-doc-primary/20 via-doc-secondary/20 to-doc-accent/20 rounded-2xl blur-sm"></div>
            
            <div className="relative z-10">
              {state === 'initial' && (
                <div className="animate-fade-in">
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              )}

              {(state === 'file_uploaded' || state === 'suggestion_received') && selectedFile && (
                <div className="animate-fade-in">
                  <DocumentAnalysis
                    file={selectedFile}
                    onModelSelect={handleModelSelect}
                    onProcess={handleProcess}
                    showSuggestion={showSuggestion}
                  />
                </div>
              )}

              {state === 'results_displayed' && (
                <div className="animate-fade-in">
                  <ResultsView
                    selectedModel={selectedModel}
                    onStartOver={handleStartOver}
                  />
                </div>
              )}

              {state === 'processing' && <ProcessingView />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
