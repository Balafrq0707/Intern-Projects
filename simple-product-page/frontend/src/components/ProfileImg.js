import React, { useState } from 'react';
import '../App.css';

function ProfileImageUploader({ userId }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [cloudUrl, setCloudUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert('Please select an image first.');

    const formData = new FormData();
    formData.append('image', image);

    try {
      setUploading(true);

      const response = await fetch(`http://localhost:3001/profile/${userId}/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Upload failed');
      }

      const data = await response.json();
      setCloudUrl(data.imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-uploader">
      <h2 style={{ marginBottom: '30px' }}>Upload Profile Picture</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="profile-preview">
          <img src={preview} alt="Preview" />
        </div>
      )}

      <button className="upload-button" onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {cloudUrl && (
        <div className="upload-success">
          <p>Upload successful!</p>
          <img src={cloudUrl} alt="Uploaded profile" style={{ maxWidth: '200px', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}

export default ProfileImageUploader;
