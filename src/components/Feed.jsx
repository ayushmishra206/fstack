import React, { useEffect, useState } from "react";
import { API_URL } from '../utils/config';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch posts');
      }
      const data = await res.json();
      console.log('Posts fetched:', data); // Add logging for debugging
      setPosts(data);
    } catch (err) {
      console.error('Feed error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <div className="text-center py-4">Loading posts...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <article key={post.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            {post.user?.avatar && (
              <img 
                src={post.user.avatar} 
                alt=""
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <h3 className="font-semibold">{post.user?.name || "Unknown User"}</h3>
              <time className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </time>
            </div>
          </div>
          <p className="mt-2">{post.content}</p>
        </article>
      ))}
    </div>
  );
}
