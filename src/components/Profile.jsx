import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from '../utils/config';
import EditProfileModal from './EditProfileModal';
import Navbar from './Navbar';  // Add this import

export default function Profile({ user, onUpdate, onLogout }) {  // Add onLogout prop
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUserStats();
  }, [user.id]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}`);
      const data = await res.json();
      setStats({
        followers: data._count?.followers || 0,
        following: data._count?.following || 0
      });
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    onUpdate(updatedUser);
    fetchUserStats(); // Refresh stats after update
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLogout={onLogout} />
      <div className="max-w-2xl mx-auto border-x border-default min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-default px-4 py-2">
          <div className="flex items-center">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full mr-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <span className="text-sm text-secondary">{stats._count?.posts || 0} posts</span>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="relative">
          <div className="h-48 bg-gray-100">
            {user.banner && (
              <img src={user.banner} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute -bottom-16 left-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50"
            >
              Edit profile
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <span className="text-gray-500">@{user.username || user.name.toLowerCase()}</span>
            
            <div className="mt-3 text-gray-700">
              {user.bio && <p className="mb-2">{user.bio}</p>}
              
              <div className="flex items-center space-x-4 text-gray-500">
                {user.location && (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    <svg className="w-5 h-5 mr-1 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    {user.website}
                  </a>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mt-3 text-gray-500">
              <Link to={`/${user.id}/following`} className="hover:underline">
                <span className="font-bold text-black">{stats.following}</span> Following
              </Link>
              <Link to={`/${user.id}/followers`} className="hover:underline">
                <span className="font-bold text-black">{stats.followers}</span> Followers
              </Link>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal 
            user={user}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
}