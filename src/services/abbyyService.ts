import { DocumentAi } from "@abbyy-sdk/document-ai";

const ABBYY_API_KEY = "abbyy_LwenrOSzOZLWTyNyAZaWvSjtHsBaz0buuPIIEshN30j3kfP9m";

export class AbbyyDocumentService {
  private documentAi: DocumentAi;

  constructor() {
    this.documentAi = new DocumentAi({
      apiKeyAuth: ABBYY_API_KEY,
    });
  }

  async processInvoiceDocument(file: File): Promise<any> {
    try {
      // Convert file to base64 for upload
      const fileBuffer = await file.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(fileBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      console.log('Starting invoice processing with ABBYY...');

      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Begin field extraction
      const extractRequest = await this.documentAi.models.invoice.beginFieldExtraction({
        inputSource: {
          url: fileUrl,
        },
      });

      const docId = extractRequest.documents?.[0]?.id;
      if (!docId) {
        throw new Error('Failed to get document ID from ABBYY response');
      }

      console.log(`Document uploaded with ID: ${docId}, polling for results...`);

      // Poll for results
      let processed = false;
      let response;
      let attempts = 0;
      const maxAttempts = 20; // Maximum 1 minute wait time

      while (!processed && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        response = await this.documentAi.models.invoice.getExtractedFields({
          documentId: docId,
        });

        processed = response.invoice?.meta?.status === "Processed";
        attempts++;

        console.log(`Polling attempt ${attempts}: Status = ${response.invoice?.meta?.status}`);

        if (response.invoice?.meta?.status === "Failed") {
          throw new Error('Document processing failed');
        }
      }

      if (!processed) {
        throw new Error('Document processing timed out');
      }

      console.log('Invoice processing completed successfully');
      return {
        invoice: response.invoice,
        rawResponse: response,
      };

    } catch (error) {
      console.error('ABBYY processing error:', error);
      throw error;
    }
  }

  async processDocument(file: File, modelType: string): Promise<any> {
    switch (modelType) {
      case 'invoice_fast':
      case 'invoice_advanced':
        return this.processInvoiceDocument(file);
      default:
        throw new Error(`Model type ${modelType} not yet implemented`);
    }
  }
}

export const abbyyService = new AbbyyDocumentService();