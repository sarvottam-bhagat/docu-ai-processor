import { useEffect } from 'react';

export const useMobileUploadPolling = (onFileSelect: (file: File) => void) => {
  useEffect(() => {
    const checkForMobileUploads = () => {
      // Check localStorage for any mobile uploads
      const keys = Object.keys(localStorage);
      const mobileUploadKeys = keys.filter(key => key.startsWith('mobile-upload-'));
      
      mobileUploadKeys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          if (data && data.data && data.name) {
            // Convert base64 back to file
            const binaryString = atob(data.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const file = new File([bytes], data.name, { type: data.type });
            
            // Call the file select handler
            onFileSelect(file);
            
            // Clean up the localStorage entry
            localStorage.removeItem(key);
          }
        } catch (error) {
          console.error('Error processing mobile upload:', error);
          // Clean up invalid entries
          localStorage.removeItem(key);
        }
      });
    };

    // Check immediately and then every 2 seconds
    checkForMobileUploads();
    const interval = setInterval(checkForMobileUploads, 2000);

    return () => clearInterval(interval);
  }, [onFileSelect]);
};