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
    <div className="min-h-screen bg-background font-inter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Document AI Processor
            </h1>
            <p className="text-gray-600">
              Upload your documents and let AI extract the data for you
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            {state === 'initial' && (
              <FileUpload onFileSelect={handleFileSelect} />
            )}

            {(state === 'file_uploaded' || state === 'suggestion_received') && selectedFile && (
              <DocumentAnalysis
                file={selectedFile}
                onModelSelect={handleModelSelect}
                onProcess={handleProcess}
                showSuggestion={showSuggestion}
              />
            )}

            {state === 'results_displayed' && (
              <ResultsView
                selectedModel={selectedModel}
                onStartOver={handleStartOver}
              />
            )}

            {state === 'processing' && <ProcessingView />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
