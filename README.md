﻿# Ksense Code Challenge - Event Storage Lambda Service

This AWS Lambda function is built to receive and store webhook payloads for the Ksense Code Challenge. It captures the payload from API Gateway and persists it to Amazon S3, allowing you to extract the secret message.

## Challenge Requirements

- **One-time payload reception**: The webhook URL can only receive the payload once
- **Secret message extraction**: After receiving the payload, extract the secret code
- **Storage**: Built to securely store the payload for later access
- **Code quality**: Focus on readability, efficiency, maintainability, and best practices

## Features

- Receives payloads via AWS API Gateway
- Stores complete event data in Amazon S3
- Generates unique filenames with timestamps
- Supports JSON payload parsing with robust error handling
- Provides detailed error handling and logging

## Implementation Details

The service is built with Node.js and TypeScript, using the AWS SDK v3 for S3 interactions.

### Main Components

- **Lambda Handler**: Processes incoming API Gateway events
- **S3 Storage**: Persists events for later analysis or extraction of the secret code
- **Error Handling**: Provides graceful error responses and detailed logging

## Setup and Deployment

### Prerequisites

- Node.js (v18)
- AWS CLI configured with appropriate credentials
- An S3 bucket for storing the events

### Environment Variables

The function requires the following environment variables:

- `BUCKET_NAME`: The name of the S3 bucket where events will be stored
- `AWS_REGION`: The AWS region for the S3 client (e.g., `us-east-1`)

### Installation and Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install

3. Build the TypeScript code:
   ```bash
   npm run build

5. Bundle for deployment:
   ```bash
   npm run bundle

### Deploying via AWS Console (Dashboard)

For a visual approach, you can deploy by logging into the AWS Management Console, navigating to the Lambda service, clicking "Create function", selecting "Author from scratch", entering "event-storage-service" as the function name, choosing Node.js 18.x runtime, configuring the execution role with S3 write permissions, uploading your function.zip file as the code source, setting environment variables (BUCKET_NAME and AWS_REGION), and finally configuring an API Gateway trigger to expose your webhook endpoint.

