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

    // For now, return a mock response to test the connection
    console.log('Returning mock data for testing...');
    
    const mockResponse = {
      invoice: {
        meta: {
          status: "Processed"
        },
        fields: {
          invoiceNumber: { value: "INV-2024-001" },
          vendorName: { value: "Test Vendor Inc." },
          totalAmount: { value: "1,234.56" },
          currency: { value: "USD" },
          dateIssued: { value: "2024-01-15" }
        }
      }
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: mockResponse,
      modelType: modelType
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in process-document function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
        details: error.stack
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