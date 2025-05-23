import React, { useState } from "react";
import { API_URL } from '../utils/config';
import ImageUploadButton from './ImageUploadButton';

export default function PostForm({ user, onPost }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          content: content.trim(),
          images 
        }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      setContent("");
      setImages([]);
      if (onPost) onPost();
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-default">
      <div className="flex">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt=""
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex-1">
          <textarea
            className="w-full border-none focus:ring-0 text-xl resize-none"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            disabled={isLoading}
          />
          {images.length > 0 && (
            <div className="flex gap-2 my-2">
              {images.map((url, index) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="w-24 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <ImageUploadButton 
              onUpload={url => setImages([...images, url])}
              loading={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !content.trim()}
              className="btn-primary px-5 py-2 disabled:opacity-50"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
