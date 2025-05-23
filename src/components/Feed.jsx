import React, { useEffect, useState } from "react";
import { API_URL } from '../utils/config';
import Post from './Post';

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
    <div className="max-w-2xl mx-auto px-4">
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <Post post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
