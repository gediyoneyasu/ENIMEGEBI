import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import './ContactMessages.css';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('enimegebiToken');
      
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }
      
      // Use the correct endpoint: /api/contact/messages
      const response = await axios.get(`${API_URL}/api/contact/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Messages response:', response.data);
      
      if (response.data.success && response.data.messages) {
        setMessages(response.data.messages);
      } else if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      showAlert('error', 'Please enter a reply message');
      return;
    }
    
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      const response = await axios.put(`${API_URL}/api/contact/messages/${selectedMessage._id}`, 
        { status: 'replied', reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update local state
        setMessages(messages.map(msg => 
          msg._id === selectedMessage._id 
            ? { ...msg, status: 'replied', reply: replyText, repliedAt: new Date().toISOString() }
            : msg
        ));
        
        setShowReplyModal(false);
        setSelectedMessage(null);
        setReplyText('');
        showAlert('success', 'Reply sent successfully');
      }
      
    } catch (error) {
      console.error('Reply error:', error);
      showAlert('error', 'Failed to send reply');
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      await axios.put(`${API_URL}/api/contact/messages/${messageId}`, 
        { status: 'read' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(messages.map(msg => 
        msg._id === messageId && msg.status === 'unread'
          ? { ...msg, status: 'read' }
          : msg
      ));
      showAlert('success', 'Message marked as read');
      
    } catch (error) {
      showAlert('error', 'Failed to mark as read');
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        
        await axios.delete(`${API_URL}/api/contact/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMessages(messages.filter(msg => msg._id !== messageId));
        showAlert('success', 'Message deleted successfully');
        
      } catch (error) {
        console.error('Delete error:', error);
        showAlert('error', 'Failed to delete message');
      }
    }
  };

  const getFilteredMessages = () => {
    let filtered = [...messages];
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(m => m.status === selectedStatus);
    }
    return filtered;
  };

  const filteredMessages = getFilteredMessages();

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'unread': return 'status-badge unread';
      case 'read': return 'status-badge read';
      case 'replied': return 'status-badge replied';
      default: return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'unread': return 'Unread';
      case 'read': return 'Read';
      case 'replied': return 'Replied';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="messages-management">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <i className={alert.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {alert.message}
        </div>
      )}
      
      <div className="management-header">
        <h2><i className="ri-mail-line"></i> Contact Messages</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="ri-search-line"></i>
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <button className="refresh-btn" onClick={fetchMessages}>
            <i className="ri-refresh-line"></i> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="info-message">
          <i className="ri-information-line"></i>
          <span>{error}</span>
          <button onClick={fetchMessages}>Retry</button>
        </div>
      )}

      {filteredMessages.length === 0 ? (
        <div className="no-messages">
          <i className="ri-mail-line"></i>
          <h3>No messages found</h3>
          <p>No contact messages yet</p>
          <button className="refresh-btn" onClick={fetchMessages} style={{ marginTop: '20px' }}>
            <i className="ri-refresh-line"></i> Refresh
          </button>
        </div>
      ) : (
        <div className="messages-table-wrapper">
          <table className="messages-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(message => (
                <tr key={message._id} className={message.status === 'unread' ? 'unread-row' : ''}>
                  <td>
                    <strong>{message.name}</strong>
                    <br />
                    <small>{message.email}</small>
                   </td>
                  <td>{message.subject}</td>
                  <td>
                    <div className="message-preview">
                      {message.message.length > 60 
                        ? message.message.substring(0, 60) + '...' 
                        : message.message}
                    </div>
                    {message.reply && (
                      <div className="reply-indicator">
                        <i className="ri-reply-line"></i> Replied
                      </div>
                    )}
                   </td>
                  <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                  <td><span className={getStatusBadgeClass(message.status)}>
                    {getStatusText(message.status)}
                  </span></td>
                  <td className="action-buttons">
                    <button 
                      className="btn-view" 
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowReplyModal(true);
                      }}
                    >
                      <i className="ri-eye-line"></i> View
                    </button>
                    {message.status === 'unread' && (
                      <button 
                        className="btn-read" 
                        onClick={() => markAsRead(message._id)}
                      >
                        <i className="ri-mail-check-line"></i> Read
                      </button>
                    )}
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(message._id)}
                    >
                      <i className="ri-delete-bin-line"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3><i className="ri-reply-line"></i> Reply to Message</h3>
            
            <div className="message-details">
              <div className="detail-item">
                <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
              </div>
              <div className="detail-item">
                <strong>Subject:</strong> {selectedMessage.subject}
              </div>
              <div className="detail-item">
                <strong>Message:</strong>
                <p>{selectedMessage.message}</p>
              </div>
            </div>
            
            <div className="form-group">
              <label>Your Reply</label>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="5"
                placeholder="Type your reply here..."
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowReplyModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-save" onClick={sendReply}>
                <i className="ri-send-plane-line"></i> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
