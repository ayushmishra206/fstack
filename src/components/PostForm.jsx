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
    <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow p-4">
      <textarea
        className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        disabled={isLoading}
      />
      <div className="flex justify-end mt-2">
        <button 
          type="submit"
          disabled={isLoading || !content.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
