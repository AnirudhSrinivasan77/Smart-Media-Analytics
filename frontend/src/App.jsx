import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 🚩 BASE URL (Your API Gateway Invoke URL)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 🔗 API ENDPOINTS
  const IMAGES_API = `${BASE_URL}/images`; // For fetching the gallery
  const UPLOAD_API = `${BASE_URL}/upload`; // For getting the upload ticket

  const fetchGallery = () => {
    setLoading(true);
    fetch(IMAGES_API) // <--- USES /images
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get the "Ticket" (Presigned Post) from /upload
      const ticketResponse = await fetch(UPLOAD_API); // <--- USES /upload
      const ticket = await ticketResponse.json();

      // 2. Prepare Form Data for S3
      const formData = new FormData();
      Object.entries(ticket.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      // 3. Post directly to S3
      const uploadResponse = await fetch(ticket.url, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        alert("Upload Successful! Analyzing image...");
        // Wait 4 seconds for AWS Rekognition to finish before refreshing
        setTimeout(fetchGallery, 4000);
      } else {
        alert("S3 Upload Failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error during upload process.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  return (
    <div className="dashboard">
      <header className="top-bar">
        <div className="logo-section">
          <div className="pulse-icon"></div>
          <h1>Vision<span>Analytics</span></h1>
        </div>
        
        <div className="action-section">
          <span className="data-count">{images.length} Objects Detected</span>
          
          {/* NEW UPLOAD BUTTON */}
          <label className="upload-pill">
            <span>{uploading ? "UPLOADING..." : "+ UPLOAD NEW"}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={uploading}
              style={{ display: 'none' }} 
            />
          </label>

          <button className="refresh-trigger" onClick={fetchGallery} disabled={loading}>
            {loading ? "SYNCING..." : "REFRESH DATA"}
          </button>
        </div>
      </header>

      <main className="content-stage">
        {loading ? (
          <div className="loading-container">
            <div className="loader-line"></div>
            <p>CONNECTING TO AWS REKOGNITION...</p>
          </div>
        ) : (
          <div className="strict-grid">
            {images.map((item) => (
              <div key={item.ImageID} className="media-card">
                <div className="image-frame">
                  <img src={item.ImageUrl} alt="AI Scan" />
                  <div className="confidence-label">
                    {parseFloat(item.Confidence).toFixed(2)}% MATCH
                  </div>
                </div>
                <div className="info-area">
                  <h3 className="file-name">{item.FileName}</h3>
                  <div className="label-wrap">
                    {item.Labels.slice(0, 4).map((label, i) => (
                      <span key={i} className="pill">{label}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;