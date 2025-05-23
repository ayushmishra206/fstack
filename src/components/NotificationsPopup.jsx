import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';

export default function NotificationsPopup({ user, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${user.id}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch notifications');
      
      setNotifications(data.slice(0, 5));
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
      <div className="p-4 border-b sticky top-0 bg-white">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Notifications</h3>
          <Link to="/notifications" className="text-sm text-blue-500 hover:underline">
            See all
          </Link>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-6 h-6 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <img 
                  src={notif.sender.avatar || '/default-avatar.png'} 
                  alt="" 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <Link to={`/profile/${notif.sender.id}`} className="font-bold hover:underline">
                      {notif.sender.name}
                    </Link>
                    {' '}{notif.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
