import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/config';

export default function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.filter(user => user.id !== currentUser.id));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id })
      });
      if (!res.ok) throw new Error('Failed to follow user');
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/unfollow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id })
      });
      if (!res.ok) throw new Error('Failed to unfollow user');
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-4">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      {users.map(user => {
        const isFollowing = user.followers?.some(f => f.id === currentUser.id);
        
        return (
          <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              {user.avatar && (
                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
              )}
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user._count?.followers || 0} followers
                </p>
              </div>
            </div>
            <button
              onClick={() => isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
              className={`px-4 py-2 rounded ${
                isFollowing 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
