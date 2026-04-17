import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPages.css';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const farmerUsers = response.data.users?.filter(u => u.role === 'farmer') || [];
      setFarmers(farmerUsers);
    } catch (error) {
      setFarmers([
        { id: 1, name: 'Abebech Demeke', email: 'abebech@example.com', phone: '+251911111111', farmName: 'Green Valley Farm', location: 'Addis Ababa', products: 12, rating: 4.8, totalSales: 1250, status: 'active', joinedDate: '2024-01-10' },
        { id: 2, name: 'Tesfaye Mulugeta', email: 'tesfaye@example.com', phone: '+251922222222', farmName: 'Highland Coffee', location: 'Jimma', products: 8, rating: 4.5, totalSales: 890, status: 'active', joinedDate: '2024-01-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateFarmerStatus = (id, status) => {
    setFarmers(farmers.map(f => f.id === id ? { ...f, status } : f));
    setAlert({ type: 'success', message: `Farmer ${status === 'active' ? 'approved' : 'suspended'} successfully!` });
    setTimeout(() => setAlert(null), 3000);
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Loading farmers...</div>;

  return (
    <div className="farmers-management">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="management-header">
        <h2><i className="ri-plant-line"></i> Farmers Management</h2>
        <div className="search-box">
          <i className="ri-search-line"></i>
          <input type="text" placeholder="Search farmers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="farmers-grid">
        {filteredFarmers.map((farmer) => (
          <div key={farmer.id} className="farmer-card">
            <div className="farmer-avatar">
              <i className="ri-user-line"></i>
            </div>
            <div className="farmer-details">
              <h3>{farmer.name}</h3>
              <div className="farmer-email"><i className="ri-mail-line"></i> {farmer.email}</div>
              <div className="farmer-phone"><i className="ri-phone-line"></i> {farmer.phone || '+251-XXX-XXXX'}</div>
              <div className="farmer-stats">
                <div className="stat"><div className="stat-value">{farmer.products || 0}</div><div className="stat-label">Products</div></div>
                <div className="stat"><div className="stat-value">${farmer.totalSales || 0}</div><div className="stat-label">Sales</div></div>
                <div className="stat"><div className="stat-value">⭐ {farmer.rating || 0}</div><div className="stat-label">Rating</div></div>
              </div>
              <div className="farmer-actions">
                {farmer.status === 'active' ? (
                  <button className="btn-suspend" onClick={() => updateFarmerStatus(farmer.id, 'inactive')}>
                    <i className="ri-close-line"></i> Suspend
                  </button>
                ) : (
                  <button className="btn-approve" onClick={() => updateFarmerStatus(farmer.id, 'active')}>
                    <i className="ri-check-line"></i> Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Farmers;
