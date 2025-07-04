import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QrCodeModal } from './QrCodeModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileUploadButtonProps {
  onFileSelect: (file: File) => void;
}

const MobileUploadButton: React.FC<MobileUploadButtonProps> = ({ onFileSelect }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const isMobile = useIsMobile();

  // Only show on desktop/larger screens
  if (isMobile) return null;

  const handleMobileUpload = () => {
    setShowQrModal(true);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleMobileUpload}
        className="w-full mt-4 border-doc-secondary/50 hover:border-doc-secondary text-doc-secondary hover:bg-doc-secondary/10"
      >
        📱 Upload from Mobile
      </Button>

      <QrCodeModal 
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onFileSelect={onFileSelect}
      />
    </>
  );
};

export default MobileUploadButton;