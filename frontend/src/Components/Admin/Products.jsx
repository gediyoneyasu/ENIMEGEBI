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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('product', JSON.stringify(formData));
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingProduct) {
        await axios.put(`${API_URL}/api/admin/products/${editingProduct._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Product updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/products`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlert({ type: 'success', message: 'Product added successfully!' });
      }
      
      fetchProducts();
      closeModal();
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to save product' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
        setAlert({ type: 'success', message: 'Product deleted!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error:', error);
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
    setImagePreview(product.image ? `${API_URL}${product.image}` : '');
    setImageFile(null);
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
    setImagePreview('');
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Products</h2>
        <button onClick={openModal} style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Product</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', background: 'white' }}>
            {product.image && <img src={`${API_URL}${product.image}`} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />}
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => handleEdit(product)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(product._id)} style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxWidth: '90%' }}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} />}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', marginBottom: '10px' }} />
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} rows="3" style={{ width: '100%', marginBottom: '10px', padding: '8px' }}></textarea>
              <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
