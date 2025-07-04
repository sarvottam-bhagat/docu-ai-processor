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

    // Convert base64 back to blob for processing
    const binaryString = atob(file.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create FormData for ABBYY API
    const formData = new FormData();
    const blob = new Blob([bytes], { type: file.type });
    formData.append('file', blob, file.name);

    // Use the correct ABBYY API endpoint
    const apiEndpoint = 'https://cloud-westus2.abbyy.com/v1-preview/models/invoice';

    console.log(`Making request to: ${apiEndpoint}`);

    // Begin field extraction with ABBYY API
    const extractResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abbyyApiKey}`,
      },
      body: formData,
    });

    console.log(`ABBYY API response status: ${extractResponse.status}`);

    if (!extractResponse.ok) {
      const errorText = await extractResponse.text();
      console.error(`ABBYY API error (${extractResponse.status}):`, errorText);
      return new Response(JSON.stringify({
        success: false,
        error: `ABBYY API error: ${extractResponse.status} - ${errorText}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const extractResult = await extractResponse.json();
    const documentId = extractResult.documents?.[0]?.id;
    
    if (!documentId) {
      console.error('ABBYY response:', extractResult);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to get document ID from ABBYY response'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Document uploaded with ID: ${documentId}, polling for results...`);

    // Poll for results
    let processed = false;
    let response;
    let attempts = 0;
    const maxAttempts = 20;

    while (!processed && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const statusResponse = await fetch(`https://cloud-westus2.abbyy.com/v1-preview/models/invoice/${documentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${abbyyApiKey}`,
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status check error:', errorText);
        return new Response(JSON.stringify({
          success: false,
          error: `Failed to check status: ${statusResponse.status} - ${errorText}`
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      response = await statusResponse.json();
      processed = response.invoice?.meta?.status === "Processed";
      attempts++;

      console.log(`Polling attempt ${attempts}: Status = ${response.invoice?.meta?.status || 'Unknown'}`);

      if (response.invoice?.meta?.status === "Failed") {
        return new Response(JSON.stringify({
          success: false,
          error: 'Document processing failed'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    if (!processed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Document processing timed out'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Document processing completed successfully');
    
    return new Response(JSON.stringify({
      success: true,
      data: response,
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