import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ onLogout }) {
  return (
    <nav className="w-full bg-white/90 shadow-md flex items-center justify-center fixed top-0 left-0 z-10 h-20">
      <div className="flex items-center justify-between w-full max-w-4xl px-8">
        <div className="font-extrabold text-blue-700 text-2xl tracking-wide">Fstack.app</div>
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-blue-700 font-medium hover:text-blue-900 transition">Home</Link>
          <Link to="/profile" className="text-blue-700 font-medium hover:text-blue-900 transition">Profile</Link>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-2"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
