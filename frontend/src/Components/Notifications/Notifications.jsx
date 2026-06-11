import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('enimegebiToken')}`
  });

  useEffect(() => {
    const token = localStorage.getItem('enimegebiToken');
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications`, { headers: getHeaders() });
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, { headers: getHeaders() });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${API_URL}/api/notifications/read-all`, {}, { headers: getHeaders() });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const iconForType = (type) => {
    if (type === 'order' || type === 'order_update') return 'ri-shopping-bag-line';
    if (type === 'reply') return 'ri-mail-line';
    return 'ri-notification-3-line';
  };

  if (loading) {
    return <div className="notif-page-loading">Loading notifications...</div>;
  }

  return (
    <div className="notif-page">
      <div className="notif-page-header">
        <h1><i className="ri-notification-3-line"></i> Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button className="notif-mark-all" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="notif-empty">
          <i className="ri-notification-off-line"></i>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notif-item ${n.read ? 'read' : 'unread'}`}
              onClick={() => {
                if (!n.read) markRead(n._id);
                if (n.link) navigate(n.link);
              }}
            >
              <div className="notif-icon">
                <i className={iconForType(n.type)}></i>
              </div>
              <div className="notif-body">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span className="notif-time">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.read && <span className="notif-dot" />}
            </div>
          ))}
        </div>
      )}

      <Link to="/" className="notif-back">← Back to Home</Link>
    </div>
  );
};

export default Notifications;
