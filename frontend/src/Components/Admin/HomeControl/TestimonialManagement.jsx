import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'import.meta.env.VITE_API_URL';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nameAm: '',
    comment: '',
    commentAm: '',
    rating: 5,
    position: 'Customer',
    positionAm: 'ደንበኛ',
    active: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/home/testimonials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(response.data.testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
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
    submitData.append('testimonial', JSON.stringify(formData));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingTestimonial) {
        await axios.put(`${API_URL}/api/home/testimonials/${editingTestimonial._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Testimonial updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/home/testimonials`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Testimonial added successfully!' });
      }
      
      fetchTestimonials();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      setAlert({ type: 'error', message: 'Failed to save testimonial' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/home/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTestimonials();
        setAlert({ type: 'success', message: 'Testimonial deleted successfully!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      nameAm: testimonial.nameAm || '',
      comment: testimonial.comment,
      commentAm: testimonial.commentAm || '',
      rating: testimonial.rating || 5,
      position: testimonial.position || 'Customer',
      positionAm: testimonial.positionAm || 'ደንበኛ',
      active: testimonial.active
    });
    setImagePreview(testimonial.image ? `${API_URL}${testimonial.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      nameAm: '',
      comment: '',
      commentAm: '',
      rating: 5,
      position: 'Customer',
      positionAm: 'ደንበኛ',
      active: true
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="loading-spinner">Loading testimonials...</div>;

  return (
    <div className="testimonial-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-star-line"></i> Testimonial Management</h2>
        <button className="add-btn" onClick={openModal}>
          <i className="ri-add-line"></i> Add Testimonial
        </button>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="testimonial-card-admin">
            <div className="testimonial-image-admin">
              <img src={testimonial.image ? `${API_URL}${testimonial.image}` : 'https://randomuser.me/api/portraits/men/1.jpg'} alt={testimonial.name} />
            </div>
            <div className="testimonial-info-admin">
              <h3>{testimonial.name}</h3>
              <p className="testimonial-comment">"{testimonial.comment.substring(0, 80)}..."</p>
              <div className="testimonial-rating-admin">{renderStars(testimonial.rating)}</div>
              <p className="testimonial-position">{testimonial.position}</p>
              <span className={`status-badge ${testimonial.active ? 'active' : 'inactive'}`}>
                {testimonial.active ? 'Active' : 'Inactive'}
              </span>
              <div className="testimonial-actions">
                <button className="btn-edit" onClick={() => handleEdit(testimonial)}>
                  <i className="ri-edit-line"></i> Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(testimonial._id)}>
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
            <h3><i className="ri-star-line"></i> {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Image</label>
                {imagePreview && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              
              <div className="form-group"><label>Name (English) *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Name (Amharic)</label><input type="text" name="nameAm" value={formData.nameAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Comment (English) *</label><textarea name="comment" value={formData.comment} onChange={handleInputChange} rows="3" required /></div>
              <div className="form-group"><label>Comment (Amharic)</label><textarea name="commentAm" value={formData.commentAm} onChange={handleInputChange} rows="3" /></div>
              <div className="form-group"><label>Rating</label><select name="rating" value={formData.rating} onChange={handleInputChange}>
                <option value={5}>★★★★★ (5)</option><option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option><option value={2}>★★☆☆☆ (2)</option><option value={1}>★☆☆☆☆ (1)</option>
              </select></div>
              <div className="form-group"><label>Position (English)</label><input type="text" name="position" value={formData.position} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Position (Amharic)</label><input type="text" name="positionAm" value={formData.positionAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Status</label><select name="active" value={formData.active} onChange={handleInputChange}><option value={true}>Active</option><option value={false}>Inactive</option></select></div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save">{editingTestimonial ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
