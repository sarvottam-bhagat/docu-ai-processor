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
    <div className="min-h-screen bg-background font-inter relative">
      {/* Three distinct background sections */}
      <div className="fixed inset-0 z-0">
        {/* Car scene background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('/lovable-uploads/9e9469b7-67f1-4c1a-857a-d1ee26f70637.png')` }}
        ></div>
        
        {/* Neon nightclub background - appears on scroll */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('/lovable-uploads/65d85017-b536-46a7-81b8-d1cb3b25713b.png')`,
            transform: 'translateY(100vh)'
          }}
          id="neon-bg"
        ></div>
        
        {/* Tropical background - appears on further scroll */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('/lovable-uploads/7f930dad-665a-437d-901f-d0527627aa2f.png')`,
            transform: 'translateY(200vh)'
          }}
          id="tropical-bg"
        ></div>
        
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70"></div>
      </div>
      
      {/* Floating neon orbs */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-doc-primary/20 rounded-full blur-xl animate-pulse z-10"></div>
      <div className="fixed bottom-1/3 right-1/4 w-48 h-48 bg-doc-secondary/20 rounded-full blur-xl animate-pulse delay-700 z-10"></div>
      <div className="fixed top-1/2 right-1/3 w-24 h-24 bg-doc-accent/30 rounded-full blur-xl animate-pulse delay-1000 z-10"></div>
      
      {/* Scrollable content */}
      <div className="relative z-20 min-h-[300vh]">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-doc-primary via-doc-secondary to-doc-accent bg-clip-text text-transparent mb-6 animate-glow-pulse leading-tight">
                Welcome to Intelligent Document Processing using ABBYY
              </h1>
              <p className="text-xl text-doc-accent font-semibold mb-4">
                powered by RAG and MCP Server
              </p>
              <p className="text-lg text-foreground/80 font-medium">
                ✨ Upload your docs and let AI do the magic ✨
              </p>
            </div>

            {/* Main Content Container */}
            <div className="bg-card-bg/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-card-border/50 p-8 relative overflow-hidden">
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

        {/* Car Scene Image Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative group overflow-hidden rounded-2xl border border-doc-primary/30 shadow-2xl">
              <img 
                src="/lovable-uploads/a57415d4-dd4b-451e-bb6a-3ad25bdd2b69.png"
                alt="Car Scene Aesthetic"
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                  🚗 Ride the Future
                </h3>
                <p className="text-white/90 text-lg drop-shadow-md">
                  Where technology meets lifestyle
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section with Neon background */}
        <div className="container mx-auto px-4 py-20 min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-doc-secondary to-doc-accent bg-clip-text text-transparent mb-12">
              🚀 Powered by AI
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card-bg/40 backdrop-blur-xl rounded-xl p-8 border border-card-border/50">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-foreground mb-4">Lightning Fast</h3>
                <p className="text-foreground/80">Process documents in seconds with our advanced AI models</p>
              </div>
              <div className="bg-card-bg/40 backdrop-blur-xl rounded-xl p-8 border border-card-border/50">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-foreground mb-4">Highly Accurate</h3>
                <p className="text-foreground/80">99.9% accuracy rate across all document types</p>
              </div>
              <div className="bg-card-bg/40 backdrop-blur-xl rounded-xl p-8 border border-card-border/50">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-foreground mb-4">Secure</h3>
                <p className="text-foreground/80">Your documents are processed securely and never stored</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section with Tropical background */}
        <div className="container mx-auto px-4 py-20 min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-doc-accent to-doc-primary bg-clip-text text-transparent mb-12">
              🌴 The Future is Here
            </h2>
            <div className="bg-card-bg/40 backdrop-blur-xl rounded-2xl p-12 border border-card-border/50">
              <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                Experience the next generation of document processing. Our AI doesn't just read your documents - it understands them, extracts meaningful data, and delivers results that exceed human accuracy.
              </p>
              <button className="bg-gradient-to-r from-doc-primary to-doc-secondary hover:from-doc-primary-hover hover:to-doc-secondary text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-doc-primary/25">
                🔮 Try It Now
              </button>
            </div>
          </div>
        </div>

        {/* Footer Section with Images */}
        <footer className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-doc-primary to-doc-secondary bg-clip-text text-transparent mb-4">
                🌟 Experience the Vibe
              </h3>
              <p className="text-foreground/80 text-lg">
                Where cutting-edge AI meets next-gen aesthetics
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Neon Dreams Image */}
              <div className="relative group">
                <div className="overflow-hidden rounded-2xl border border-doc-primary/30 shadow-2xl">
                  <img 
                    src="/lovable-uploads/f89df29f-7a3c-431a-a4ab-9690bbd17631.png"
                    alt="Neon Dreams Aesthetic"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-doc-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-lg drop-shadow-lg">✨ Neon Dreams</p>
                </div>
              </div>

              {/* Tropical Vibes Image */}
              <div className="relative group">
                <div className="overflow-hidden rounded-2xl border border-doc-secondary/30 shadow-2xl">
                  <img 
                    src="/lovable-uploads/5883d317-b1ed-493b-9f97-e827b5822755.png"
                    alt="Tropical Vibes Aesthetic"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-doc-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-lg drop-shadow-lg">🌴 Tropical Vibes</p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="text-center border-t border-card-border/30 pt-8">
              <p className="text-foreground/60 mb-4">
                © 2024 Intelligent Document Processing using ABBYY • Powered by RAG and MCP Server
              </p>
              <div className="flex justify-center space-x-6">
                <span className="text-doc-primary font-semibold">⚡ Lightning Fast</span>
                <span className="text-doc-secondary font-semibold">🎯 Highly Accurate</span>
                <span className="text-doc-accent font-semibold">🔒 Secure</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
