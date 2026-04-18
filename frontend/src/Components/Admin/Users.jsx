import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('import.meta.env.VITE_API_URL/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading users...</div>;

  return (
    <div>
      <h2>User Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>City</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>{user.phone || '-'}</td>
                <td style={{ padding: '12px' }}>{user.city || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: user.role === 'admin' ? '#ff9800' : user.role === 'farmer' ? '#4caf50' : '#2196f3', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '12px' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
