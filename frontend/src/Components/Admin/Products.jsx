import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>Product Management</h2>
      <button style={{ marginBottom: '20px', padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Add Product
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Stock</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{product.name}</td>
              <td style={{ padding: '10px' }}>${product.price}</td>
              <td style={{ padding: '10px' }}>{product.stock}</td>
              <td style={{ padding: '10px' }}>{product.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
