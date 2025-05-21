import React, { useState } from "react";

export default function Profile({ user, onUpdate }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMessage("Profile updated!");
      onUpdate(data);
    } catch (err) {
      setMessage(err.message);
    }
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