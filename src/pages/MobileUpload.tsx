import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MobileUpload = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!sessionId) {
      toast({
        title: "❌ Invalid Session",
        description: "No session ID found. Please scan the QR code again.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:xxx;base64, prefix
        };
        reader.readAsDataURL(file);
      });

      // Store the file data temporarily (in a real app, this would be sent to a server)
      const fileData = {
        name: file.name,
        type: file.type,
        data: base64Data,
        sessionId: sessionId,
        timestamp: Date.now()
      };

      // Store in localStorage temporarily (in production, use proper backend storage)
      localStorage.setItem(`mobile-upload-${sessionId}`, JSON.stringify(fileData));

      setUploadComplete(true);
      toast({
        title: "✅ Upload Successful!",
        description: "Your document has been uploaded. You can now return to your desktop.",
      });

      // Auto-navigate away after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "❌ Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-doc-primary/10 via-background to-doc-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card-bg/95 backdrop-blur-xl border border-card-border/50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Upload Complete!</h2>
            <p className="text-foreground/70">
              Your document has been successfully uploaded. You can now return to your desktop.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-doc-primary/10 via-background to-doc-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card-bg/95 backdrop-blur-xl border border-card-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-doc-primary to-doc-secondary bg-clip-text text-transparent">
            📱 Mobile Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            <div className="p-8 border-2 border-dashed border-doc-primary/30 rounded-xl hover:border-doc-primary/60 transition-colors">
              <UploadCloud className="w-12 h-12 text-doc-primary mx-auto mb-4" />
              <p className="text-foreground/80 mb-4">
                Select a document to upload
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-doc-primary to-doc-secondary hover:from-doc-primary-hover hover:to-doc-secondary text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {isUploading ? 'Uploading...' : '📄 Choose File'}
              </Button>
            </div>
            
            <div className="text-xs text-foreground/50">
              <p>Session: {sessionId}</p>
              <p className="mt-1">Supports PNG, JPG, JPEG, PDF files</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileUpload;