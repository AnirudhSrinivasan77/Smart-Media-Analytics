import boto3
import json
import urllib.parse
import uuid

# Initialize clients
rekog = boto3.client('rekognition')
# Connect to your new table
dynamodb = boto3.resource('dynamodb').Table('ImageMetadata')

def lambda_handler(event, context):
    try:
        # 1. Get info from S3
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
        
        # 2. AI Analysis
        response = rekog.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=10,
            MinConfidence=80
        )
        
        labels = [label['Name'] for label in response['Labels']]
        top_confidence = str(response['Labels'][0]['Confidence'])

        # 3. Save to DynamoDB
        # We store the Filename, the AI Labels, and the time
        dynamodb.put_item(Item={
            'ImageID': str(uuid.uuid4()), # Unique ID for the DB
            'FileName': key,
            'Labels': labels,
            'Confidence': top_confidence,
            'Bucket': bucket
        })

        print(f"✅ Success! Saved {key} labels to DynamoDB.")
        
        return {"status": "success", "file": key}

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {"status": "error"}
        