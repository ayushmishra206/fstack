import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

export default function Navbar({ onLogout }) {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="text-xl font-extrabold text-[--primary]">
          Fstack
        </Link>
        <div className="flex-1 max-w-xl mx-8">
          <Search />
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-[--primary] transition">
            Home
          </Link>
          <Link to="/profile" className="font-medium hover:text-[--primary] transition">
            Profile
          </Link>
          <button
            onClick={onLogout}
            className="btn-primary px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
