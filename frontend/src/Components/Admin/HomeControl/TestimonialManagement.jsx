import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '', nameAm: '', comment: '', commentAm: '', rating: 5, position: 'Customer', positionAm: 'ደንበኛ', active: true
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
    submitData.append('testimonial', JSON.stringify(formData));
    if (imageFile) submitData.append('image', imageFile);

    try {
      const token = localStorage.getItem('enimegebiToken');
      if (editingTestimonial) {
        await axios.put(`${API_URL}/api/home/testimonials/${editingTestimonial._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Testimonial updated!' });
      } else {
        await axios.post(`${API_URL}/api/home/testimonials`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Testimonial added!' });
      }
      fetchTestimonials();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/home/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTestimonials();
        setAlert({ type: 'success', message: 'Testimonial deleted!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (t) => {
    setEditingTestimonial(t);
    setFormData({
      name: t.name, nameAm: t.nameAm || '', comment: t.comment, commentAm: t.commentAm || '',
      rating: t.rating || 5, position: t.position || 'Customer', positionAm: t.positionAm || 'ደንበኛ', active: t.active
    });
    setImagePreview(t.image ? `${API_URL}${t.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '', nameAm: '', comment: '', commentAm: '', rating: 5,
      position: 'Customer', positionAm: 'ደንበኛ', active: true
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  if (loading) return <div>Loading testimonials...</div>;

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      <div className="management-header">
        <h2>Testimonials</h2>
        <button className="add-btn" onClick={openModal}>Add Testimonial</button>
      </div>
      <div className="testimonials-grid">
        {testimonials.map(t => (
          <div key={t._id} className="testimonial-card-admin">
            <img src={t.image ? `${API_URL}${t.image}` : 'https://via.placeholder.com/50'} alt={t.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            <div><strong>{t.name}</strong><br/>{t.comment.substring(0, 50)}...<br/>{renderStars(t.rating)}</div>
            <div><span className={`status-badge ${t.active ? 'active' : 'inactive'}`}>{t.active ? 'Active' : 'Inactive'}</span></div>
            <div>
              <button className="btn-edit" onClick={() => handleEdit(t)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <form onSubmit={handleSubmit}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <input type="text" name="name" placeholder="Name (English)" value={formData.name} onChange={handleInputChange} required />
              <input type="text" name="nameAm" placeholder="Name (Amharic)" value={formData.nameAm} onChange={handleInputChange} />
              <textarea name="comment" placeholder="Comment (English)" value={formData.comment} onChange={handleInputChange} required />
              <textarea name="commentAm" placeholder="Comment (Amharic)" value={formData.commentAm} onChange={handleInputChange} />
              <select name="rating" value={formData.rating} onChange={handleInputChange}>
                <option value={5}>★★★★★ (5)</option><option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option><option value={2}>★★☆☆☆ (2)</option><option value={1}>★☆☆☆☆ (1)</option>
              </select>
              <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleInputChange} />
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

export default TestimonialManagement;
