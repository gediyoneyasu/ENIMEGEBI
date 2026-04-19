import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.put(`${API_URL}/api/admin/contacts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
      setAlert({ type: 'success', message: 'Message marked as read!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error marking message:', error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading messages...</div>;

  return (
    <div className="contact-messages">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-mail-line"></i> Contact Messages</h2>
      </div>

      <div className="messages-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} style={{ background: msg.status === 'unread' ? '#fff3e0' : 'white' }}>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td><strong>{msg.subject}</strong></td>
                <td>{msg.message}</td>
                <td>
                  <span className={`status-badge ${msg.status}`}>
                    {msg.status === 'unread' ? 'Unread' : 'Read'}
                  </span>
                </td>
                <td>
                  {msg.status === 'unread' && (
                    <button className="btn-view" onClick={() => markAsRead(msg._id)}>
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {messages.length === 0 && (
        <div className="no-messages">
          <i className="ri-mail-line"></i>
          <p>No messages yet</p>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
