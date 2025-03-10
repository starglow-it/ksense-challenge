import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Environment validation
const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;

if (!BUCKET_NAME) {
  throw new Error('BUCKET_NAME environment variable is required');
}

if (!AWS_REGION) {
  throw new Error('AWS_REGION environment variable is required');
}

// Initialize S3 client outside the handler for reuse across invocations
const s3Client = new S3Client({ region: AWS_REGION });

/**
 * Lambda handler that receives an event and stores it in S3
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Parse the payload from the request body if it exists
    let payload = event;
    if (event.body) {
      try {
        payload = JSON.parse(event.body);
        console.log('Parsed body:', JSON.stringify(payload, null, 2));
      } catch (parseError) {
        console.warn('Could not parse event body as JSON, using raw body:', event.body);
        payload = { rawBody: event.body, ...event };
      }
    }

    // Generate a unique filename using timestamp and a random string
    const timestamp = new Date().toISOString();
    const randomId = Math.random().toString(36).substring(2, 15);
    const filename = `payloads/${timestamp}-${randomId}.json`;
    
    // Store payload in S3
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: JSON.stringify(payload, null, 2),
      ContentType: 'application/json'
    }));
    
    console.log(`Payload saved to s3://${BUCKET_NAME}/${filename}`);
    
    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // For CORS support
      },
      body: JSON.stringify({
        message: 'Payload received successfully',
        reference: filename,
        timestamp: timestamp
      })
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Failed to process payload',
        message: errorMessage
      })
    };
  }
};