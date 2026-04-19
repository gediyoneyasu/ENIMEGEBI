import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nameAm: '',
    description: '',
    descriptionAm: '',
    icon: 'ri-apps-line',
    color: '#c9a66b',
    order: 0,
    active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data.categories);
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
    submitData.append('category', JSON.stringify(formData));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingCategory) {
        await axios.put(`${API_URL}/api/categories/${editingCategory._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Category updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/categories`, submitData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setAlert({ type: 'success', message: 'Category added successfully!' });
      }
      
      fetchCategories();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: 'Failed to save category' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCategories();
        setAlert({ type: 'success', message: 'Category deleted!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameAm: category.nameAm || '',
      description: category.description || '',
      descriptionAm: category.descriptionAm || '',
      icon: category.icon || 'ri-apps-line',
      color: category.color || '#c9a66b',
      order: category.order || 0,
      active: category.active
    });
    setImagePreview(category.image ? `${API_URL}${category.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '', nameAm: '', description: '', descriptionAm: '',
      icon: 'ri-apps-line', color: '#c9a66b', order: 0, active: true
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview('');
  };

  const iconOptions = [
    'ri-cup-line', 'ri-seedling-line', 'ri-drop-line', 'ri-drinks-line',
    'ri-apple-line', 'ri-leaf-line', 'ri-fire-line', 'ri-drinks-2-line',
    'ri-restaurant-line', 'ri-cake-line', 'ri-bread-line', 'ri-egg-line'
  ];

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="category-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-apps-line"></i> Category Management</h2>
        <button className="add-btn" onClick={openModal}>
          <i className="ri-add-line"></i> Add Category
        </button>
      </div>

      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name (EN)</th>
              <th>Name (AM)</th>
              <th>Icon</th>
              <th>Color</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id}>
                <td>
                  {category.image ? (
                    <img src={`${API_URL}${category.image}`} alt={category.name} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                  ) : (
                    <div className="no-image-small"><i className="ri-image-line"></i></div>
                  )}
                </td>
                <td><strong>{category.name}</strong></td>
                <td>{category.nameAm || '-'}</td>
                <td><i className={category.icon} style={{ fontSize: '20px', color: category.color }}></i></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: category.color }}></div>
                    {category.color}
                  </div>
                </td>
                <td>{category.order}</td>
                <td>
                  <span className={`status-badge ${category.active ? 'active' : 'inactive'}`}>
                    {category.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(category)}>
                    <i className="ri-edit-line"></i> Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(category._id)}>
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3><i className="ri-apps-line"></i> {editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Image</label>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              
              <div className="form-group"><label>Name (English) *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Name (Amharic)</label><input type="text" name="nameAm" value={formData.nameAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Description (English)</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea></div>
              <div className="form-group"><label>Description (Amharic)</label><textarea name="descriptionAm" value={formData.descriptionAm} onChange={handleInputChange} rows="3"></textarea></div>
              
              <div className="form-group">
                <label>Icon</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '10px' }}>
                  {iconOptions.map(icon => (
                    <div
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      style={{
                        padding: '10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: formData.icon === icon ? `2px solid ${formData.color}` : '1px solid #ddd',
                        borderRadius: '8px',
                        background: formData.icon === icon ? `${formData.color}20` : 'white'
                      }}
                    >
                      <i className={icon} style={{ fontSize: '24px', color: formData.color }}></i>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Color</label>
                <input type="color" name="color" value={formData.color} onChange={handleInputChange} style={{ width: '60px', height: '40px' }} />
                <span style={{ marginLeft: '10px' }}>{formData.color}</span>
              </div>
              
              <div className="form-group"><label>Order (lower number appears first)</label><input type="number" name="order" value={formData.order} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Status</label><select name="active" value={formData.active} onChange={handleInputChange}><option value={true}>Active</option><option value={false}>Inactive</option></select></div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save Category</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
