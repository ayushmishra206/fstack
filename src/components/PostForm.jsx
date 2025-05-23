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
    <div className="bg-white rounded-xl shadow max-w-2xl mx-auto mb-4 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3 py-4">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              className="w-full border-0 focus:ring-0 text-gray-900 text-lg resize-none bg-transparent px-0"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              disabled={isLoading}
            />
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((url, index) => (
                  <div key={url} className="relative pt-[56.25%] rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={url} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/75"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <ImageUploadButton 
                  onUpload={url => setImages([...images, url])}
                  loading={isLoading}
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading || !content.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full disabled:opacity-50 transition-all"
              >
                {isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
