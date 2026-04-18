import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'import.meta.env.VITE_API_URL';

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    titleAm: '',
    subtitle: '',
    subtitleAm: '',
    buttonText: 'Shop Now',
    buttonTextAm: 'አሁን ይግዙ',
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/home/sliders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSliders(response.data.sliders);
    } catch (error) {
      console.error('Error fetching sliders:', error);
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
    submitData.append('slider', JSON.stringify(formData));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingSlider) {
        await axios.put(`${API_URL}/api/home/sliders/${editingSlider._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Slider updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/home/sliders`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Slider added successfully!' });
      }
      
      fetchSliders();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error saving slider:', error);
      setAlert({ type: 'error', message: 'Failed to save slider' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/home/sliders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSliders();
        setAlert({ type: 'success', message: 'Slider deleted successfully!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error deleting slider:', error);
      }
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      titleAm: slider.titleAm || '',
      subtitle: slider.subtitle || '',
      subtitleAm: slider.subtitleAm || '',
      buttonText: slider.buttonText || 'Shop Now',
      buttonTextAm: slider.buttonTextAm || 'አሁን ይግዙ',
      order: slider.order || 0,
      active: slider.active
    });
    setImagePreview(slider.image ? `${API_URL}${slider.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingSlider(null);
    setFormData({
      title: '',
      titleAm: '',
      subtitle: '',
      subtitleAm: '',
      buttonText: 'Shop Now',
      buttonTextAm: 'አሁን ይግዙ',
      order: 0,
      active: true
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlider(null);
  };

  if (loading) return <div className="loading-spinner">Loading sliders...</div>;

  return (
    <div className="slider-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-image-line"></i> Slider Management</h2>
        <button className="add-btn" onClick={openModal}>
          <i className="ri-add-line"></i> Add Slider
        </button>
      </div>

      <div className="sliders-list">
        {sliders.map((slider) => (
          <div key={slider._id} className="slider-item">
            <div className="slider-preview">
              <img src={`${API_URL}${slider.image}`} alt={slider.title} onError={(e) => { e.target.src = 'https://via.placeholder.com/200x120?text=No+Image'; }} />
              <span className={`slider-status ${slider.active ? 'active' : 'inactive'}`}>
                {slider.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="slider-info">
              <h3>{slider.title}</h3>
              <p className="slider-subtitle">{slider.subtitle}</p>
              <p className="slider-order">Order: {slider.order}</p>
              <div className="slider-actions">
                <button className="btn-edit" onClick={() => handleEdit(slider)}>
                  <i className="ri-edit-line"></i> Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(slider._id)}>
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
            <h3><i className="ri-image-line"></i> {editingSlider ? 'Edit Slider' : 'Add New Slider'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Slider Image *</label>
                {imagePreview && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} required={!editingSlider} />
              </div>
              
              <div className="form-group"><label>Title (English) *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Title (Amharic)</label><input type="text" name="titleAm" value={formData.titleAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Subtitle (English)</label><input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Subtitle (Amharic)</label><input type="text" name="subtitleAm" value={formData.subtitleAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Button Text (English)</label><input type="text" name="buttonText" value={formData.buttonText} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Button Text (Amharic)</label><input type="text" name="buttonTextAm" value={formData.buttonTextAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Order</label><input type="number" name="order" value={formData.order} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Status</label><select name="active" value={formData.active} onChange={handleInputChange}><option value={true}>Active</option><option value={false}>Inactive</option></select></div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save">{editingSlider ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderManagement;
