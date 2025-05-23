import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user.id]);

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

  if (loading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="divide-y">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`p-4 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
          onClick={() => !notif.read && markAsRead(notif.id)}
        >
          <div className="flex items-start space-x-3">
            <img 
              src={notif.sender.avatar || '/default-avatar.png'} 
              alt="" 
              className="w-10 h-10 rounded-full"
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
      ))}
      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notifications yet
        </div>
      )}
    </div>
  );
}
