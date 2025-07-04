import { supabase } from "@/integrations/supabase/client";

export class AbbyyDocumentService {
  async processDocument(file: File, modelType: string): Promise<any> {
    try {
      // Convert file to base64 for sending to edge function
      const fileBuffer = await file.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(fileBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      console.log(`Starting ${modelType} processing via Edge Function...`);

      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          file: {
            name: file.name,
            type: file.type,
            data: base64Data
          },
          modelType: modelType
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(`Processing failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown processing error');
      }

      console.log('Document processing completed successfully');
      return data.data;

    } catch (error) {
      console.error('Document processing error:', error);
      throw error;
    }
  }

}

export const abbyyService = new AbbyyDocumentService();