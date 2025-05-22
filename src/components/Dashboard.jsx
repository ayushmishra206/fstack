import React from "react";
import Navbar from "./Navbar";
import PostForm from "./PostForm";
import Feed from "./Feed";
import UserList from "./UserList";

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col">
      <Navbar onLogout={onLogout} />
      <main className="container mx-auto px-4 pt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PostForm user={user} />
          <Feed />
        </div>
        <div className="md:col-span-1">
          <UserList currentUser={user} />
        </div>
      </main>
    </div>
  );
}