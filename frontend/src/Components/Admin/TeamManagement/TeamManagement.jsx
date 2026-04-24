import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formData, setFormData] = useState({
    name: '', nameAm: '', role: '', roleAm: '', bio: '', bioAm: '', order: 0, active: true
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
      console.error('Error:', error);
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('team', JSON.stringify({ ...formData, imageUrl: imageUrlInput.trim() }));
    if (imageFile) submitData.append('image', imageFile);

    try {
      const token = localStorage.getItem('enimegebiToken');
      if (editingMember) {
        await axios.put(`${API_URL}/api/team/${editingMember._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Team member updated!' });
      } else {
        await axios.post(`${API_URL}/api/team`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Team member added!' });
      }
      fetchTeam();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this team member?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/team/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeam();
        setAlert({ type: 'success', message: 'Team member deleted!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name, nameAm: member.nameAm || '', role: member.role, roleAm: member.roleAm || '',
      bio: member.bio || '', bioAm: member.bioAm || '', order: member.order || 0, active: member.active
    });
    const currentImage = member.imageUrl || member.image || '';
    setImagePreview(currentImage ? (currentImage.startsWith('http') ? currentImage : `${API_URL}${currentImage}`) : '');
    setImageUrlInput(currentImage && currentImage.startsWith('http') ? currentImage : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingMember(null);
    setFormData({ name: '', nameAm: '', role: '', roleAm: '', bio: '', bioAm: '', order: 0, active: true });
    setImagePreview('');
    setImageUrlInput('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  if (loading) return <div>Loading team...</div>;

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      <div className="management-header">
        <h2>Team Members</h2>
        <button className="add-btn" onClick={openModal}>Add Team Member</button>
      </div>
      <div className="team-grid-admin">
        {team.map(member => (
          <div key={member._id} className="team-card-admin">
            <img src={(member.imageUrl || member.image) ? ((member.imageUrl || member.image).startsWith('http') ? (member.imageUrl || member.image) : `${API_URL}${member.imageUrl || member.image}`) : 'https://via.placeholder.com/80'} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
            <div><strong>{member.name}</strong><br/>{member.role}<br/>{member.bio?.substring(0, 50)}</div>
            <div><span className={`status-badge ${member.active ? 'active' : 'inactive'}`}>{member.active ? 'Active' : 'Inactive'}</span></div>
            <div>
              <button className="btn-edit" onClick={() => handleEdit(member)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(member._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleSubmit}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <input
                type="url"
                placeholder="Or paste image URL (optional)"
                value={imageUrlInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setImageUrlInput(value);
                  if (value.trim()) {
                    setImagePreview(value.trim());
                    setImageFile(null);
                  }
                }}
              />
              <input type="text" name="name" placeholder="Name (English)" value={formData.name} onChange={handleInputChange} required />
              <input type="text" name="nameAm" placeholder="Name (Amharic)" value={formData.nameAm} onChange={handleInputChange} />
              <input type="text" name="role" placeholder="Role (English)" value={formData.role} onChange={handleInputChange} required />
              <input type="text" name="roleAm" placeholder="Role (Amharic)" value={formData.roleAm} onChange={handleInputChange} />
              <textarea name="bio" placeholder="Bio (English)" value={formData.bio} onChange={handleInputChange} rows="3" />
              <textarea name="bioAm" placeholder="Bio (Amharic)" value={formData.bioAm} onChange={handleInputChange} rows="3" />
              <input type="number" name="order" placeholder="Order" value={formData.order} onChange={handleInputChange} />
              <select name="active" value={formData.active} onChange={handleInputChange}>
                <option value={true}>Active</option><option value={false}>Inactive</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
