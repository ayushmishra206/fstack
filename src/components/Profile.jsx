import React, { useState } from "react";

export default function Profile({ user, onUpdate }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name, bio, avatar };
    // Update user in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // Also update in users array if present
    const users = JSON.parse(localStorage.getItem('users') || "[]");
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, bio, avatar };
      localStorage.setItem('users', JSON.stringify(users));
    }
    setMessage("Profile updated!");
    onUpdate(updatedUser);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            className="w-full border border-blue-200 p-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bio</label>
          <textarea
            className="w-full border border-blue-200 p-2 rounded"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Avatar URL</label>
          <input
            className="w-full border border-blue-200 p-2 rounded"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.png"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Save Changes
        </button>
        {message && <div className="text-green-600 mt-2">{message}</div>}
      </form>
      {avatar && (
        <div className="mt-6 flex flex-col items-center">
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border" />
          <span className="text-sm text-gray-500 mt-2">Preview</span>
        </div>
      )}
    </div>
  );
}