import React from "react";

function exportUsers() {
  const users = localStorage.getItem('users');
  if (users) {
    const blob = new Blob([users], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default function Navbar({ onLogout }) {
  return (
    <nav className="w-full bg-white/90 shadow flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-10">
      <div className="font-bold text-blue-700 text-xl">Dashboard</div>
      <div className="flex gap-6">
        <a href="#" className="text-blue-600 hover:underline">Home</a>
        <a href="#" className="text-blue-600 hover:underline">Profile</a>
        <a href="#" className="text-blue-600 hover:underline">Settings</a>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          onClick={exportUsers}
        >
          Export Users
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 ml-4"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
