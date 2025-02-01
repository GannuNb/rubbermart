// /frontend/src/components/UploadFile.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage('Please select files first');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);

      // Assuming response contains the saved document with an array of file IDs
      const fileIds = response.data.savedRecord.files.map((file) => `http://localhost:4000/api/files/image/${file.fileId}`);
      setImageUrls(fileIds);
    } catch (error) {
      setMessage('Error uploading files');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Upload Images</h1>
      <input type="file" onChange={handleFileChange} multiple />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
      <div>
        {imageUrls.length > 0 && imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Uploaded file ${index + 1}`} style={{ width: '200px', margin: '10px' }} />
        ))}
      </div>
    </div>
  );
};

export default UploadFile;
