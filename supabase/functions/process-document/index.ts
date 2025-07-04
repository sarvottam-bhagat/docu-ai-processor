import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessDocumentRequest {
  file: {
    name: string;
    type: string;
    data: string; // base64 encoded file data
  };
  modelType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Edge Function Started ===');
    
    const { file, modelType }: ProcessDocumentRequest = await req.json();
    console.log(`Processing ${modelType} document: ${file.name}`);
    
    const abbyyApiKey = Deno.env.get('ABBYY_API_KEY');
    if (!abbyyApiKey) {
      console.error('ABBYY API key not found in environment');
      return new Response(JSON.stringify({
        success: false,
        error: 'ABBYY API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('ABBYY API key found, starting processing...');

    // For debugging: Let's return a detailed response about what we received
    console.log(`File received: ${file.name}, type: ${file.type}, data length: ${file.data.length}`);
    
    // Convert base64 back to blob for processing
    const binaryString = atob(file.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log(`Converted to ${bytes.length} bytes`);

    // TEMPORARY: Skip ABBYY API and return mock data with file info
    const mockResponseWithFileInfo = {
      invoice: {
        meta: {
          status: "Processed",
          fileName: file.name,
          fileType: file.type,
          fileSize: bytes.length,
          processedAt: new Date().toISOString()
        },
        fields: {
          invoiceNumber: { value: "INV-2024-001", confidence: 0.95 },
          vendorName: { value: "Test Vendor Inc.", confidence: 0.92 },
          totalAmount: { value: "1,234.56", confidence: 0.98 },
          currency: { value: "USD", confidence: 0.99 },
          dateIssued: { value: "2024-01-15", confidence: 0.94 }
        }
      }
    };
    
    console.log('Processing completed successfully (mock data)');
    
    return new Response(JSON.stringify({
      success: true,
      data: mockResponseWithFileInfo,
      modelType: modelType
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('=== ERROR IN EDGE FUNCTION ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error type:', typeof error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
        details: error.stack,
        errorType: typeof error,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);