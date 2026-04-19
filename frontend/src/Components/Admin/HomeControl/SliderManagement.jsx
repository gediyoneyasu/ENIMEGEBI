import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

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
    submitData.append('slider', JSON.stringify(formData));
    if (imageFile) submitData.append('image', imageFile);

    try {
      const token = localStorage.getItem('enimegebiToken');
      if (editingSlider) {
        await axios.put(`${API_URL}/api/home/sliders/${editingSlider._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Slider updated!' });
      } else {
        await axios.post(`${API_URL}/api/home/sliders`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Slider added!' });
      }
      fetchSliders();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save slider' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this slider?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/home/sliders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSliders();
        setAlert({ type: 'success', message: 'Slider deleted!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error:', error);
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
      title: '', titleAm: '', subtitle: '', subtitleAm: '',
      buttonText: 'Shop Now', buttonTextAm: 'አሁን ይግዙ', order: 0, active: true
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlider(null);
  };

  if (loading) return <div>Loading sliders...</div>;

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      <div className="management-header">
        <h2>Home Sliders</h2>
        <button className="add-btn" onClick={openModal}>Add Slider</button>
      </div>
      <div className="sliders-list">
        {sliders.map(slider => (
          <div key={slider._id} className="slider-item">
            <img src={`${API_URL}${slider.image}`} alt={slider.title} style={{ width: '150px', height: '80px', objectFit: 'cover' }} />
            <div><strong>{slider.title}</strong><br/>{slider.subtitle}</div>
            <div><span className={`status-badge ${slider.active ? 'active' : 'inactive'}`}>{slider.active ? 'Active' : 'Inactive'}</span></div>
            <div>
              <button className="btn-edit" onClick={() => handleEdit(slider)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(slider._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingSlider ? 'Edit Slider' : 'Add Slider'}</h3>
            <form onSubmit={handleSubmit}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
              <input type="file" accept="image/*" onChange={handleImageChange} required={!editingSlider} />
              <input type="text" name="title" placeholder="Title (English)" value={formData.title} onChange={handleInputChange} required />
              <input type="text" name="titleAm" placeholder="Title (Amharic)" value={formData.titleAm} onChange={handleInputChange} />
              <input type="text" name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleInputChange} />
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

export default SliderManagement;
