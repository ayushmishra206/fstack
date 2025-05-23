import React, { useState } from 'react';
import { API_URL } from '../utils/config';

export default function ImageUploadButton({ onUpload, loading, icon = true }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      onUpload(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        className="hidden"
        id="image-upload"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading || loading}
      />
      <label
        htmlFor="image-upload"
        className={`inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer ${
          (uploading || loading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {icon && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
      </label>
    </div>
  );
}
