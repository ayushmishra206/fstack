import React, { useState } from 'react';
import { API_URL } from '../utils/config';

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    avatar: user.avatar || '',
    banner: user.banner || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value // Convert empty strings to null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const cleanedData = {
        ...formData,
        username: formData.username?.trim().toLowerCase() || null,
        website: formData.website?.trim() || null,
        location: formData.location?.trim() || null,
        bio: formData.bio?.trim() || null,
      };

      const res = await fetch(`${API_URL}/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await res.json();
      console.log('Profile updated:', updatedUser); // Debug log
      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="p-2 -m-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold">Edit profile</h2>
          </div>
          <button 
            type="submit"
            form="edit-profile-form"
            className="btn-primary px-5 py-1.5"
          >
            Save
          </button>
        </div>

        <form id="edit-profile-form" onSubmit={handleSubmit}>
          {/* Banner Section */}
          <div className="relative h-40 bg-gray-100 group">
            {formData.banner ? (
              <>
                <img 
                  src={formData.banner} 
                  alt="Banner" 
                  className="w-full h-full object-cover"
                  onError={() => setFormData(prev => ({ ...prev, banner: null }))}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input
                    type="text"
                    name="banner"
                    value={formData.banner}
                    onChange={handleChange}
                    placeholder="Change banner image URL"
                    className="w-3/4 px-4 py-2 bg-white/90 backdrop-blur rounded-lg text-center"
                  />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <input
                  type="text"
                  name="banner"
                  value={formData.banner || ''}
                  onChange={handleChange}
                  placeholder="Add banner image URL"
                  className="w-3/4 px-4 py-2 border rounded-lg text-center shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar Section */}
            <div className="relative -mt-12 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                <img
                  src={formData.avatar || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                name="avatar"
                value={formData.avatar || ''}
                onChange={handleChange}
                placeholder="Avatar URL"
                className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    maxLength={15}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    maxLength={30}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
