import React, { useState } from 'react';
import { API_URL } from '../utils/config';

export default function ImageUpload({ onUpload, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      onUpload(multiple ? data.urls : data.urls[0]);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />
      <label 
        htmlFor="image-upload"
        className="cursor-pointer inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
