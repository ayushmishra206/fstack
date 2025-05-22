import React, { useEffect, useState } from "react";
import { API_URL } from '../utils/config';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from:', `${API_URL}/api/posts`);
      const res = await fetch(`${API_URL}/api/posts`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch posts');
      }
      
      const data = await res.json();
      console.log('Fetched posts:', data);
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error('Feed error:', err);
      setError('Could not load posts. Server might be down.');
      // Retry up to 3 times with increasing delay
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000 * (retryCount + 1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [retryCount]);

  if (isLoading) return <div className="text-center py-4">Loading posts...</div>;
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
        {retryCount < 3 && <p className="text-sm text-gray-500">Retrying...</p>}
      </div>
    );
  }

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
