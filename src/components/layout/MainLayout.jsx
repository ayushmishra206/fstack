import React from 'react';
import Navbar from '../Navbar';

export default function MainLayout({ user, children, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex gap-8 pt-16">
          {/* Main Content */}
          <main className="flex-1 max-w-2xl mx-auto">
            {children}
          </main>
          
          {/* Right Sidebar - Trending & Suggestions */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-bold text-xl mb-4">What's happening</h2>
                {/* Trending topics will go here */}
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-bold text-xl mb-4">Who to follow</h2>
                {/* User suggestions will go here */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
