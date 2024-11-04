// ImageUploadBox.js
import React, { useState } from 'react';
import Image from 'next/image';

const ImageUploadBox = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: { target: { files: any[]; }; }) => {
    const file = event.target.files[0];

    if (file) {
      // Begin upload process
      setUploading(true);

      // Simulate an upload delay (replace with actual upload logic)
      setTimeout(() => {
        // Create a local URL of the uploaded file
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        setUploading(false);
      }, 2000); // Simulate a 2-second upload
    }
  };

  return (
    <div
      className="image-upload-box"
      style={{
        width: '300px',
        height: '250px',
        backgroundColor: '#4a65bf', // Blue background
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        color: '#fff',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {!image && !uploading && (
        <label
          htmlFor="file-input"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <p className='text-[#fff] font-[600] max-w-lg'>Click or Drag & Drop to Upload</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
      )}

      {uploading && <p>Uploading...</p>}

      {image && (
        <Image
          src={image}
          alt="Uploaded"
          width={350}
          height={350}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
};

export default ImageUploadBox;
