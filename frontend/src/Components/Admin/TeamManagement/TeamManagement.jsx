import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'import.meta.env.VITE_API_URL';

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nameAm: '',
    role: '',
    roleAm: '',
    bio: '',
    bioAm: '',
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeam(response.data.team);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('team', JSON.stringify(formData));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingMember) {
        await axios.put(`${API_URL}/api/team/${editingMember._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Team member updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/team`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Team member added successfully!' });
      }
      
      fetchTeam();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error saving team member:', error);
      setAlert({ type: 'error', message: 'Failed to save team member' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/team/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeam();
        setAlert({ type: 'success', message: 'Team member deleted successfully!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      nameAm: member.nameAm || '',
      role: member.role,
      roleAm: member.roleAm || '',
      bio: member.bio || '',
      bioAm: member.bioAm || '',
      order: member.order || 0,
      active: member.active
    });
    setImagePreview(member.image ? `${API_URL}${member.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      nameAm: '',
      role: '',
      roleAm: '',
      bio: '',
      bioAm: '',
      order: 0,
      active: true
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  if (loading) return <div className="loading-spinner">Loading team members...</div>;

  return (
    <div className="team-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-team-line"></i> Team Management</h2>
        <button className="add-btn" onClick={openModal}>
          <i className="ri-add-line"></i> Add Team Member
        </button>
      </div>

      <div className="team-grid-admin">
        {team.map((member) => (
          <div key={member._id} className="team-card-admin">
            <div className="team-image-admin">
              <img src={member.image ? `${API_URL}${member.image}` : 'https://randomuser.me/api/portraits/men/1.jpg'} alt={member.name} />
              <span className={`status-badge ${member.active ? 'active' : 'inactive'}`}>
                {member.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="team-info-admin">
              <h3>{member.name}</h3>
              <p className="team-role-admin">{member.role}</p>
              <p className="team-bio-admin">{member.bio?.substring(0, 80)}...</p>
              <p className="team-order-admin">Order: {member.order}</p>
              <div className="team-actions-admin">
                <button className="btn-edit" onClick={() => handleEdit(member)}>
                  <i className="ri-edit-line"></i> Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(member._id)}>
                  <i className="ri-delete-bin-line"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3><i className="ri-team-line"></i> {editingMember ? 'Edit Team Member' : 'Add New Team Member'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Member Image</label>
                {imagePreview && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              
              <div className="form-group"><label>Name (English) *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Name (Amharic)</label><input type="text" name="nameAm" value={formData.nameAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Role (English) *</label><input type="text" name="role" value={formData.role} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Role (Amharic)</label><input type="text" name="roleAm" value={formData.roleAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Bio (English)</label><textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" /></div>
              <div className="form-group"><label>Bio (Amharic)</label><textarea name="bioAm" value={formData.bioAm} onChange={handleInputChange} rows="3" /></div>
              <div className="form-group"><label>Order (lower number appears first)</label><input type="number" name="order" value={formData.order} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Status</label><select name="active" value={formData.active} onChange={handleInputChange}><option value={true}>Active</option><option value={false}>Inactive</option></select></div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save">{editingMember ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
