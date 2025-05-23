import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';
import Navbar from './Navbar';

export default function Notifications({ user, onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, mentions

  useEffect(() => {
    fetchNotifications();
  }, [user.id, filter]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="max-w-2xl mx-auto pt-16 px-4">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Notifications</h1>
            
            {/* Filters */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-full ${
                  filter === 'unread' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('mentions')}
                className={`px-4 py-2 rounded-full ${
                  filter === 'mentions' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Mentions
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications {filter !== 'all' ? 'matching this filter' : ''}
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 transition ${!notif.read ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={notif.sender?.avatar || '/default-avatar.png'}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <Link
                          to={`/profile/${notif.sender?.id}`}
                          className="font-bold hover:underline"
                        >
                          {notif.sender?.name}
                        </Link>
                        {' '}{notif.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
