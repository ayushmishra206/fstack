import React from "react";

export default function Navbar({ onLogout }) {
  return (
    <nav className="w-full bg-white/90 shadow flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-10">
      <div className="font-bold text-blue-700 text-xl">Fstack Dashboard</div>
      <div className="flex gap-6">
        <a href="#" className="text-blue-600 hover:underline">Home</a>
        <a href="#" className="text-blue-600 hover:underline">Profile</a>
        <a href="#" className="text-blue-600 hover:underline">Settings</a>
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