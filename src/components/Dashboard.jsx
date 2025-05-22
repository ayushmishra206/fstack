import React from "react";
import Navbar from "./Navbar";
import PostForm from "./PostForm";
import Feed from "./Feed";

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col">
      <Navbar onLogout={onLogout} />
      <main className="flex-1 container mx-auto max-w-2xl px-4 pt-20">
        <PostForm user={user} />
        <Feed />
      </main>
    </div>
  );
}