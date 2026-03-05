# VisionAnalytics: Serverless AI Image Processor

VisionAnalytics is a high-performance, event-driven web application that uses **AWS Rekognition** to automatically analyze images and provide object detection with confidence scores. Built with a "Serverless First" mindset.

## 🚀 Live Demo
[Insert your Vercel Link Here]

## 🛠️ The Tech Stack
* **Frontend:** React.js, CSS3 (Custom 4-Column Grid), Vite
* **Storage:** Amazon S3 (Image Hosting)
* **Database:** Amazon DynamoDB (Metadata storage)
* **Compute:** AWS Lambda (Python 3.9)
* **AI Service:** AWS Rekognition (Computer Vision)
* **API Layer:** AWS API Gateway (REST)

## 🏗️ Architecture Overview
1.  **User Upload:** User selects an image from their local machine.
2.  **Presigned POST:** The React frontend requests a temporary "Upload Ticket" from an AWS Lambda to securely push the file directly to S3.
3.  **S3 Trigger:** The moment the file lands in S3, an S3 Event Notification triggers the "Processing" Lambda.
4.  **AI Analysis:** The Lambda calls Amazon Rekognition to extract labels (e.g., "Lion", "99% Match").
5.  **Metadata Storage:** The results are saved into a DynamoDB table.
6.  **Real-Time Gallery:** The React frontend fetches the analyzed data from the DynamoDB via a second API endpoint.



## ⚡ Features
* **Direct-to-S3 Uploads:** Uses Presigned URLs to bypass server bottlenecks and enhance security.
* **Strict 4-Column Grid:** A custom-engineered CSS layout for a professional dashboard experience.
* **Real-time AI Labels:** Dynamic confidence scores with precise decimal reporting.
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.

## 🔧 Installation & Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/Smart-Media-Analytics.git](https://github.com/YOUR_USERNAME/Smart-Media-Analytics.git)


Install dependencies:

Bash:
npm install

Create a .env file in the root directory and add your API URL:
Code snippet
VITE_API_BASE_URL=your_api_gateway_url

Run the development server:
Bash
npm run dev