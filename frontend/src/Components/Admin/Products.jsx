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
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingProduct) {
        await axios.put(`${API_URL}/api/admin/products/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlert({ type: 'success', message: 'Product updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlert({ type: 'success', message: 'Product added successfully!' });
      }
      
      fetchProducts();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      setAlert({ type: 'error', message: 'Failed to save product' });
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
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      status: product.status
    });
    setShowModal(true);
  };

  const openModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  if (loading) return <div className="loading-spinner">Loading products...</div>;

  return (
    <div className="products-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2>Products Management</h2>
        <button className="add-btn" onClick={openModal}>Add Product</button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
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
              <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Category</label><input type="text" name="category" value={formData.category} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Price</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea></div>
              <div className="form-group"><label>Status</label><select name="status" value={formData.status} onChange={handleInputChange}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              <div className="modal-actions"><button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button><button type="submit" className="btn-save">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
