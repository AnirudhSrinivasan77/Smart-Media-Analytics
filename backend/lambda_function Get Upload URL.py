import json
import boto3
import uuid

s3_client = boto3.client('s3')
BUCKET_NAME = "smart-media-analytics-anirudh-2026" #name of ur bucket 

def lambda_handler(event, context):
    file_name = f"{uuid.uuid4()}.jpg" # Give it a unique name
    
    # Generate the "Upload Ticket"
    conditions = [
        ["content-length-range", 0, 10485760], # Max 10MB
        ["starts-with", "$Content-Type", "image/"]
    ]
    
    presigned_post = s3_client.generate_presigned_post(
        Bucket=BUCKET_NAME,
        Key=file_name,
        Fields={"Content-Type": "image/jpeg"},
        Conditions=conditions,
        ExpiresIn=3600
    )

    return {
        "statusCode": 200,
        "headers": { "Access-Control-Allow-Origin": "*" },
        "body": json.dumps(presigned_post)
    }