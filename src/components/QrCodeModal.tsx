import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'qrcode';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, onFileSelect }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
      pollForUpload();
    }
  }, [isOpen, sessionId]);

  const generateQRCode = async () => {
    try {
      const uploadUrl = `${window.location.origin}/mobile-upload/${sessionId}`;
      const qrDataUrl = await QRCode.toDataURL(uploadUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#8B5CF6',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const pollForUpload = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/mobile-upload-status/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.fileData) {
            // Convert base64 back to file
            const binaryString = atob(data.fileData.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const file = new File([bytes], data.fileData.name, { type: data.fileData.type });
            onFileSelect(file);
            clearInterval(interval);
            onClose();
          }
        }
      } catch (error) {
        console.error('Error polling for upload:', error);
      }
    }, 2000);

    // Cleanup interval when modal closes
    setTimeout(() => clearInterval(interval), 300000); // 5 minutes timeout
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card-bg/95 backdrop-blur-xl border border-card-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-doc-primary to-doc-secondary bg-clip-text text-transparent">
            📱 Mobile Upload
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 p-6">
          <div className="text-center">
            <p className="text-foreground/80 mb-4">
              Scan this QR code with your mobile device to upload documents
            </p>
          </div>
          
          {qrCodeUrl && (
            <div className="p-4 bg-white rounded-xl shadow-lg">
              <img src={qrCodeUrl} alt="QR Code for mobile upload" className="w-64 h-64" />
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-foreground/60">
              Session ID: <span className="font-mono text-doc-primary">{sessionId}</span>
            </p>
            <p className="text-xs text-foreground/50 mt-2">
              The QR code will expire in 5 minutes
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};