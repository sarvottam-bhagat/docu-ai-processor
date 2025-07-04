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
    const { file, modelType }: ProcessDocumentRequest = await req.json();
    const abbyyApiKey = Deno.env.get('ABBYY_API_KEY');

    if (!abbyyApiKey) {
      throw new Error('ABBYY API key not configured');
    }

    console.log(`Starting ${modelType} processing with ABBYY...`);

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

    // Use the correct ABBYY API endpoint structure
    const apiEndpoint = 'https://cloud-westus2.abbyy.com/v1-preview/models/invoice';

    // Begin field extraction with ABBYY API
    const extractResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abbyyApiKey}`,
      },
      body: formData,
    });

    if (!extractResponse.ok) {
      const errorText = await extractResponse.text();
      console.error('ABBYY API error:', errorText);
      throw new Error(`ABBYY API error: ${extractResponse.status} - ${errorText}`);
    }

    const extractResult = await extractResponse.json();
    
    // Check if we got documents array with IDs
    const documentId = extractResult.documents?.[0]?.id;
    
    if (!documentId) {
      console.error('ABBYY response:', extractResult);
      throw new Error('Failed to get document ID from ABBYY response');
    }

    console.log(`Document uploaded with ID: ${documentId}, polling for results...`);

    // Poll for results using the correct endpoint
    let processed = false;
    let response;
    let attempts = 0;
    const maxAttempts = 20; // Maximum 1 minute wait time

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
        throw new Error(`Failed to check status: ${statusResponse.status} - ${errorText}`);
      }

      response = await statusResponse.json();
      
      // Check if the document processing is complete based on ABBYY API structure
      processed = response.invoice?.meta?.status === "Processed";
      attempts++;

      console.log(`Polling attempt ${attempts}: Status = ${response.invoice?.meta?.status || 'Unknown'}`);

      if (response.invoice?.meta?.status === "Failed") {
        throw new Error('Document processing failed');
      }
    }

    if (!processed) {
      throw new Error('Document processing timed out');
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
    console.error('Error in process-document function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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