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
    contentType: 'image',
    contentUrl: '',
    youtubeId: '',
    pdfUrl: '',
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
        setAlert({ type: 'success', message: 'Project updated!' });
      } else {
        await axios.post(`${API_URL}/api/projects`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Project added!' });
      }
      
      fetchProjects();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save project' });
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
      contentType: project.contentType || 'image',
      contentUrl: project.contentUrl || '',
      youtubeId: project.youtubeId || '',
      pdfUrl: project.pdfUrl || '',
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
      contentType: 'image', contentUrl: '', youtubeId: '', pdfUrl: '',
      price: '', order: 0
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      <div className="management-header">
        <h2>Project Management</h2>
        <button className="add-btn" onClick={openModal}>Add Project</button>
      </div>
      
      {projects.map(project => (
        <div key={project._id} className="project-admin-card" style={{ border: '1px solid #ddd', margin: '10px', padding: '15px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            {project.image && <img src={`${API_URL}${project.image}`} alt={project.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
            <div style={{ flex: 1 }}>
              <h3>{project.title}</h3>
              <p>Price: ${project.price} | Type: {project.contentType} | Approved: {project.isApproved ? 'Yes' : 'No'}</p>
              <p>Purchases: {project.purchasedBy?.length || 0}</p>
            </div>
            <div>
              <button className="btn-edit" onClick={() => handleEdit(project)}>Edit</button>
              {!project.isApproved && <button className="btn-approve" onClick={() => handleApprove(project._id)}>Approve</button>}
              <button className="btn-delete" onClick={() => handleDelete(project._id)}>Delete</button>
            </div>
          </div>
          {project.purchasedBy?.filter(p => !p.isUnlocked).map(purchase => (
            <div key={purchase.user} style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
              User ID: {purchase.user} | Amount: ${purchase.amount}
              <button onClick={() => handleApprovePurchase(project._id, purchase.user)}>Approve Purchase</button>
            </div>
          ))}
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>{editingProject ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={handleSubmit}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} />}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              
              <input type="text" name="title" placeholder="Title (English)" value={formData.title} onChange={handleInputChange} required />
              <input type="text" name="titleAm" placeholder="Title (Amharic)" value={formData.titleAm} onChange={handleInputChange} />
              <textarea name="description" placeholder="Description (English)" value={formData.description} onChange={handleInputChange} rows="2" />
              <textarea name="descriptionAm" placeholder="Description (Amharic)" value={formData.descriptionAm} onChange={handleInputChange} rows="2" />
              
              <select name="contentType" value={formData.contentType} onChange={handleInputChange}>
                <option value="image">Image Only</option>
                <option value="pdf">PDF Document</option>
                <option value="video">Video File</option>
                <option value="youtube">YouTube Video</option>
                <option value="link">External Link</option>
              </select>
              
              {formData.contentType === 'youtube' && (
                <input type="text" name="youtubeId" placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ)" value={formData.youtubeId} onChange={handleInputChange} />
              )}
              {(formData.contentType === 'pdf' || formData.contentType === 'video' || formData.contentType === 'link') && (
                <input type="text" name="contentUrl" placeholder="File URL or Link" value={formData.contentUrl} onChange={handleInputChange} />
              )}
              
              <input type="number" name="price" placeholder="Price (ETB)" value={formData.price} onChange={handleInputChange} required />
              <input type="number" name="order" placeholder="Order" value={formData.order} onChange={handleInputChange} />
              
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
