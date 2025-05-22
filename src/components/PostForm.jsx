import React, { useState } from "react";
import { API_URL } from '../utils/config';

export default function PostForm({ user, onPost }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, content: content.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      setContent("");
      if (onPost) onPost();
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-default bg-white">
      <div className="flex gap-4">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt=""
          className="w-12 h-12 rounded-full shrink-0"
        />
        <div className="flex-1 space-y-4">
          <textarea
            className="w-full min-h-[120px] text-lg border-none focus:ring-0 resize-none placeholder:text-gray-500"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={280}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary">
              {content.length}/280 characters
            </span>
            <button 
              type="submit"
              disabled={isLoading || !content.trim()}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
