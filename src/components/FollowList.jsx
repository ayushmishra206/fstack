import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config';
import Navbar from './Navbar';

export default function FollowList({ user: currentUser, type, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`);
      const data = await res.json();
      setUsers(type === 'followers' ? data.followers : data.following);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      <div className="max-w-2xl mx-auto pt-16">
        <div className="bg-white border-b sticky top-16 z-10">
          <div className="flex items-center p-4">
            <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="ml-6">
              <h1 className="text-xl font-bold">{type === 'followers' ? 'Followers' : 'Following'}</h1>
              <div className="text-sm text-gray-500">{users.length} people</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="divide-y">
            {users.map(user => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <Link to={`/profile/${user.id}`} className="flex items-center">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt=""
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-gray-500">@{user.username || user.name.toLowerCase()}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
