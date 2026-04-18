import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPages.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAm: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    descriptionAm: '',
    unit: 'kg',
    seller: '',
    rating: 0,
    status: 'active'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      // First, save product without image
      const productData = { ...formData };
      
      let response;
      if (editingProduct) {
        response = await axios.put(`${API_URL}/api/admin/products/${editingProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${API_URL}/api/admin/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Then upload image separately if there is one
      if (imageFile && response.data._id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('productId', response.data._id);
        
        await axios.post(`${API_URL}/api/admin/products/${response.data._id}/upload-image`, imageFormData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setAlert({ type: 'success', message: editingProduct ? 'Product updated successfully!' : 'Product added successfully!' });
      fetchProducts();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to save product' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
        setAlert({ type: 'success', message: 'Product deleted successfully!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
        setAlert({ type: 'error', message: 'Failed to delete product' });
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAm: product.nameAm || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      descriptionAm: product.descriptionAm || '',
      unit: product.unit || 'kg',
      seller: product.seller || '',
      rating: product.rating || 0,
      status: product.status
    });
    setImagePreview(product.image ? `${API_URL}${product.image}` : '');
    setImageFile(null);
    setShowModal(true);
  };

  const openModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameAm: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      descriptionAm: '',
      unit: 'kg',
      seller: '',
      rating: 0,
      status: 'active'
    });
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview('');
    setImageFile(null);
  };

  if (loading) return <div className="loading-spinner">Loading products...</div>;

  return (
    <div className="products-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-shopping-bag-3-line"></i> Products Management</h2>
        <button className="add-btn" onClick={openModal}>
          <i className="ri-add-line"></i> Add Product
        </button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.image ? (
                <img src={`${API_URL}${product.image}`} alt={product.name} />
              ) : (
                <div className="no-image"><i className="ri-image-line"></i></div>
              )}
              <span className={`product-status ${product.status}`}>{product.status}</span>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <span className="product-category">{product.category}</span>
              <div className="product-price">${product.price}</div>
              <div className="product-stock">Stock: {product.stock} units</div>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => handleEdit(product)}>
                  <i className="ri-edit-line"></i> Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                  <i className="ri-delete-bin-line"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Image (Optional)</label>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} />}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="form-group"><label>Name (English) *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Name (Amharic)</label><input type="text" name="nameAm" value={formData.nameAm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Category *</label><input type="text" name="category" value={formData.category} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Price *</label><input type="number" name="price" step="0.01" value={formData.price} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Stock *</label><input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea></div>
              <div className="form-group"><label>Status</label><select name="status" value={formData.status} onChange={handleInputChange}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save" disabled={uploading}>{uploading ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
