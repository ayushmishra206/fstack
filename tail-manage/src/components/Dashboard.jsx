import React from "react"; 
import Navbar from "./Navbar";

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center">
      <Navbar onLogout={onLogout} />
      <div className="bg-white/80 backdrop-blur shadow-xl rounded-xl p-8 w-full max-w-md text-center mt-12">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Dashboard</h2>
        <p className="mb-2 text-gray-700">
          Welcome, <span className="font-semibold">{user.name}</span>!
        </p>
        <p className="mb-6 text-gray-500 text-sm">Email: {user.email}</p>
        {/* Add more dashboard features/components here */}
      </div>
    </div>
  );
}