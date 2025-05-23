import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import NotificationsPopup from "./NotificationsPopup";
import { API_URL } from "../utils/config";

export default function Navbar({ user, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const popupRef = useRef(null);

  useEffect(() => {
    if (user?.id) fetchUnreadCount();
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user?.id]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${user.id}/unread/count`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

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
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationsPopup 
                user={user} 
                onClose={() => setShowNotifications(false)} 
              />
            )}
          </div>
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
