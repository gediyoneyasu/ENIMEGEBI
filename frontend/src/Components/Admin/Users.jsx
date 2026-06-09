import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

const API_URL = 'http://localhost:5001';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', password: '' });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('enimegebiToken');
      
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/users/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Users response:', response.data);
      
      if (response.data.success && response.data.users) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/users/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user._id !== id));
        showAlert('success', 'User deleted successfully');
      } catch (error) {
        showAlert('error', 'Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingUser) {
        await axios.put(`${API_URL}/api/users/admin/${editingUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchUsers();
        showAlert('success', 'User updated successfully');
      } else {
        await axios.post(`${API_URL}/api/users/admin`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchUsers();
        showAlert('success', 'User added successfully');
      }
      
      setShowModal(false);
      setFormData({ name: '', email: '', role: 'user', password: '' });
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to save user');
    }
  };

  const getFilteredUsers = () => {
    let filtered = [...users];
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === selectedRole);
    }
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const getRoleClass = (role) => {
    switch(role) {
      case 'admin': return 'admin';
      case 'farmer': return 'farmer';
      default: return 'user';
    }
  };

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-container">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <i className={alert.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {alert.message}
        </div>
      )}
      
      <div className="users-header">
        <h2><i className="ri-user-settings-line"></i> User Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="ri-search-line"></i>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select className="role-filter" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="farmer">Farmer</option>
            <option value="user">User</option>
          </select>
          <button className="refresh-btn" onClick={fetchUsers}>
            <i className="ri-refresh-line"></i> Refresh
          </button>
          <button className="add-user-btn" onClick={() => { 
            setEditingUser(null); 
            setFormData({ name: '', email: '', role: 'user', password: '' }); 
            setShowModal(true); 
          }}>
            <i className="ri-add-line"></i> Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="info-message">
          <i className="ri-information-line"></i>
          <span>{error}</span>
          <button onClick={fetchUsers}>Retry</button>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="no-users">
          <i className="ri-user-line"></i>
          <h3>No users found</h3>
          <p>Click "Add User" to create your first user</p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge ${getRoleClass(user.role)}`}>{user.role || 'user'}</span></td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                      <i className="ri-edit-line"></i> Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user._id)}>
                      <i className="ri-delete-bin-line"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              <i className={editingUser ? "ri-edit-line" : "ri-add-line"}></i> 
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Password *</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
