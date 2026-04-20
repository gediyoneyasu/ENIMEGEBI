import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    titleAm: '',
    description: '',
    descriptionAm: '',
    price: '',
    order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    submitData.append('project', JSON.stringify(formData));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingProject) {
        await axios.put(`${API_URL}/api/projects/${editingProject._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Project updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/projects`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Project added successfully!' });
      }
      
      fetchProjects();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to save project' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
        setAlert({ type: 'success', message: 'Project deleted!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.put(`${API_URL}/api/projects/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
      setAlert({ type: 'success', message: 'Project approved!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApprovePurchase = async (projectId, userId) => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      await axios.post(`${API_URL}/api/projects/approve-purchase`, { projectId, userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
      setAlert({ type: 'success', message: 'Purchase approved! User can now access.' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      titleAm: project.titleAm || '',
      description: project.description || '',
      descriptionAm: project.descriptionAm || '',
      price: project.price,
      order: project.order || 0
    });
    setImagePreview(project.image ? `${API_URL}${project.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingProject(null);
    setFormData({
      title: '', titleAm: '', description: '', descriptionAm: '',
      price: '', order: 0
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="project-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      
      <div className="management-header">
        <h2>Project Management</h2>
        <button className="add-btn" onClick={openModal}>Add Project</button>
      </div>

      <div className="projects-list">
        {projects.map(project => (
          <div key={project._id} className="project-item">
            <div className="project-image">
              {project.image ? (
                <img src={`${API_URL}${project.image}`} alt={project.title} />
              ) : (
                <div className="no-image"><i className="ri-image-line"></i></div>
              )}
            </div>
            <div className="project-details">
              <h3>{project.title}</h3>
              <p>Price: ${project.price}</p>
              <p>Status: {project.status} | Approved: {project.isApproved ? 'Yes' : 'No'}</p>
              <p>Purchases: {project.purchasedBy?.length || 0}</p>
              <div className="project-actions">
                <button className="btn-edit" onClick={() => handleEdit(project)}>Edit</button>
                {!project.isApproved && (
                  <button className="btn-approve" onClick={() => handleApprove(project._id)}>Approve</button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(project._id)}>Delete</button>
              </div>
            </div>
            {project.purchasedBy?.filter(p => !p.isUnlocked).length > 0 && (
              <div className="pending-purchases">
                <h4>Pending Approvals:</h4>
                {project.purchasedBy.filter(p => !p.isUnlocked).map(purchase => (
                  <div key={purchase.user} className="pending-purchase">
                    <span>User ID: {purchase.user}</span>
                    <span>Amount: ${purchase.amount}</span>
                    <button onClick={() => handleApprovePurchase(project._id, purchase.user)}>
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingProject ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Image</label>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="form-group"><label>Title (English)</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Title (Amharic)</label><input type="text" name="titleAm" value={formData.titleAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Description (English)</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required /></div>
              <div className="form-group"><label>Description (Amharic)</label><textarea name="descriptionAm" value={formData.descriptionAm} onChange={handleInputChange} rows="3" /></div>
              <div className="form-group"><label>Price (ETB)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Order (lower = first)</label><input type="number" name="order" value={formData.order} onChange={handleInputChange} /></div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save Project</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
