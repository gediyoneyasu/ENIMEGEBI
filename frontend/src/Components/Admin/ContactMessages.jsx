import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('import.meta.env.VITE_API_URL/api/admin/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.contacts);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading messages...</div>;

  return (
    <div>
      <h2>Contact Messages</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Subject</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Message</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
             </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>{msg.name}</td>
                <td style={{ padding: '12px' }}>{msg.email}</td>
                <td style={{ padding: '12px' }}>{msg.subject}</td>
                <td style={{ padding: '12px' }}>{msg.message}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: msg.status === 'unread' ? '#f44336' : '#4caf50', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '12px' }}>
                    {msg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactMessages;
