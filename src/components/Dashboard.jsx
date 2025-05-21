import React from "react";
import Navbar from "./Navbar";

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col">
      <Navbar onLogout={onLogout} />
      <div className="flex-1 flex items-center justify-center pt-16">
        <div className="bg-white/80 backdrop-blur shadow-xl rounded-xl p-8 w-full max-w-md text-center">
          <p className="mb-2 text-gray-700">
            Welcome, <span className="font-semibold">{user.name}</span>!
          </p>
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="mx-auto mb-4 w-24 h-24 rounded-full object-cover border"
            />
          )}
          <p className="mb-6 text-gray-500 text-sm">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}