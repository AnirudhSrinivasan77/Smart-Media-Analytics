import json
import boto3
from botocore.config import Config

# We use s3v4 to ensure the URL works in all regions
s3_client = boto3.client('s3', config=Config(signature_version='s3v4'))
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageMetadata')

def lambda_handler(event, context):
    response = table.scan()
    items = response.get('Items', [])
    
    # Add a temporary URL to every image in our list
    for item in items:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': item['Bucket'], 'Key': item['FileName']},
            ExpiresIn=3600 # Link lasts for 1 hour
        )
        item['ImageUrl'] = url 

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(items)
    }