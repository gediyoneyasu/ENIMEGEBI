import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminPages.css';
import getImageUrl from '../../utils/imageHelper';

const API_URL = 'https://enimegebi-backend.onrender.com';

const Products = () => {
  // ========== STATE VARIABLES ==========
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Image upload states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [urlImageInput, setUrlImageInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const singleInputRef = useRef(null);
  
  // Form data
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
    status: 'active'
  });

  // ========== FETCH PRODUCTS ==========
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.nameAm && product.nameAm.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // ========== IMAGE HANDLERS ==========
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (singleInputRef.current) singleInputRef.current.value = '';
  };

  const handleUrlImageAdd = () => {
    if (!urlImageInput.trim()) {
      showAlert('error', 'Please enter an image URL');
      return;
    }
    
    const urlPattern = /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg|bmp))/i;
    if (!urlPattern.test(urlImageInput)) {
      showAlert('error', 'Please enter a valid image URL');
      return;
    }
    
    const newPreview = urlImageInput;
    setImagePreviews([...imagePreviews, newPreview]);
    
    const fakeFile = {
      name: `url-image-${Date.now()}.jpg`,
      type: 'image/jpeg',
      size: 0,
      isUrl: true,
      url: urlImageInput
    };
    setImageFiles([...imageFiles, fakeFile]);
    
    setUrlImageInput('');
    showAlert('success', 'Image added from URL');
  };

  const addImages = (files) => {
    if (files.length === 0) return;
    
    const totalImages = imageFiles.length + files.length + existingImages.length;
    if (totalImages > 10) {
      showAlert('error', 'Maximum 10 images allowed');
      return;
    }
    
    const validFiles = [];
    const validPreviews = [];
    
    for (const file of files) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.type)) {
        if (file.size > 5 * 1024 * 1024) {
          showAlert('error', `${file.name} is larger than 5MB`);
          continue;
        }
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      } else {
        showAlert('error', `${file.name} is not a valid image`);
      }
    }
    
    if (validFiles.length > 0) {
      setImageFiles([...imageFiles, ...validFiles]);
      setImagePreviews([...imagePreviews, ...validPreviews]);
      showAlert('success', `${validFiles.length} image(s) added`);
    }
  };

  const removeNewImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
  };

  const removeExistingImage = (index) => {
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
  };

  // ========== FORM HANDLERS ==========
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ========== SUBMIT WITH FEEDBACK ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show loading state
    setIsSubmitting(true);
    showAlert('info', 'Saving product...');
    
    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      showAlert('error', 'Please fill all required fields');
      setIsSubmitting(false);
      return;
    }
    
    const submitData = new FormData();
    
    const productData = {
      name: formData.name,
      nameAm: formData.nameAm || '',
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description || '',
      descriptionAm: formData.descriptionAm || '',
      unit: formData.unit,
      seller: formData.seller || '',
      status: formData.status
    };
    
    if (editingProduct) {
      productData.existingImages = existingImages;
    }
    
    submitData.append('product', JSON.stringify(productData));
    
    for (const file of imageFiles) {
      if (file.isUrl) {
        submitData.append('imageUrls', file.url);
      } else {
        submitData.append('images', file);
      }
    }

    console.log('Submitting product:', productData);
    console.log('Number of images:', imageFiles.length);

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingProduct) {
        const response = await axios.put(`${API_URL}/api/admin/products/${editingProduct._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Update response:', response.data);
        showAlert('success', 'Product updated successfully!');
      } else {
        const response = await axios.post(`${API_URL}/api/admin/products`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Create response:', response.data);
        showAlert('success', 'Product added successfully!');
      }
      
      // Close modal after success
      setTimeout(() => {
        closeModal();
        fetchProducts();
      }, 1500);
      
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to save product';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
        showAlert('success', 'Product deleted successfully!');
      } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Failed to delete product');
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
      status: product.status
    });
    
    const existingImgUrls = product.images && product.images.length > 0 
      ? product.images 
      : (product.imageUrl ? [product.imageUrl] : []);
    
    setExistingImages(existingImgUrls);
    setImagePreviews([]);
    setImageFiles([]);
    setUrlImageInput('');
    setShowModal(true);
  };

  const openModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '', nameAm: '', category: '', price: '', stock: '',
      description: '', descriptionAm: '', unit: 'kg', seller: '', status: 'active'
    });
    setImagePreviews([]);
    setImageFiles([]);
    setExistingImages([]);
    setUrlImageInput('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    imagePreviews.forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setUrlImageInput('');
    setIsSubmitting(false);
  };

  // ========== RENDER ==========
  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading products...</p>
    </div>
  );

  return (
    <div className="products-management">
      {/* Alert Message */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <i className={alert.type === 'success' ? 'ri-checkbox-circle-line' : alert.type === 'error' ? 'ri-error-warning-line' : 'ri-information-line'}></i>
          {alert.message}
        </div>
      )}
      
      {/* Header Section */}
      <div className="management-header">
        <h2><i className="ri-shopping-bag-3-line"></i> Products Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="ri-search-line"></i>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>
          <button className="add-btn" onClick={openModal}>
            <i className="ri-add-line"></i> Add Product
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <i className="ri-shopping-bag-line"></i>
          <h3>No products found</h3>
          <p>{searchTerm ? `No results for "${searchTerm}"` : 'Click "Add Product" to create your first product'}</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img src={getImageUrl(product.images[0])} alt={product.name} />
                    {product.images.length > 1 && (
                      <div className="multi-image-badge">
                        <i className="ri-image-line"></i> {product.images.length}
                      </div>
                    )}
                  </>
                ) : product.imageUrl ? (
                  <img src={getImageUrl(product.imageUrl)} alt={product.name} />
                ) : (
                  <div className="no-image">
                    <i className="ri-image-line"></i>
                    <span>No Image</span>
                  </div>
                )}
                <span className={`product-status ${product.status}`}>{product.status}</span>
              </div>
              <div className="product-info">
                <h3 title={product.name}>{product.name}</h3>
                {product.nameAm && <p className="product-name-am">{product.nameAm}</p>}
                <span className="product-category">{product.category}</span>
                <div className="product-price">ETB {product.price?.toLocaleString()}</div>
                <div className="product-stock">
                  <i className="ri-stock-line"></i> Stock: {product.stock} units
                </div>
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
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className={editingProduct ? "ri-edit-line" : "ri-add-line"}></i>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Multiple Images Upload Section */}
              <div className="form-section">
                <label className="section-label">
                  <i className="ri-image-line"></i> Product Images
                  <span className="label-hint">Max 10 images | Drag & Drop | URL | Single Select</span>
                </label>
                
                {/* Drag & Drop Area */}
                <div 
                  className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="ri-upload-cloud-2-line"></i>
                  <p>Drag & drop images here</p>
                  <span>or</span>
                  <div className="upload-buttons">
                    <label className="upload-btn-secondary">
                      <i className="ri-folder-image-line"></i> Select Multiple
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                    </label>
                    <label className="upload-btn-secondary">
                      <i className="ri-image-line"></i> Select Single
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        ref={singleInputRef}
                      />
                    </label>
                  </div>
                </div>
                
                {/* URL Image Input */}
                <div className="url-input-area">
                  <input 
                    type="text" 
                    placeholder="Enter image URL (https://...jpg, .png, .gif)"
                    value={urlImageInput}
                    onChange={(e) => setUrlImageInput(e.target.value)}
                  />
                  <button type="button" className="add-url-btn" onClick={handleUrlImageAdd}>
                    <i className="ri-link"></i> Add from URL
                  </button>
                </div>
                
                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="image-previews">
                    <div className="preview-header">
                      <i className="ri-image-add-line"></i>
                      <span>New Images ({imagePreviews.length})</span>
                      <button 
                        type="button" 
                        className="clear-all-btn"
                        onClick={() => {
                          setImageFiles([]);
                          setImagePreviews([]);
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="previews-grid">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="preview-item">
                          <img src={preview} alt={`Preview ${idx + 1}`} />
                          <button 
                            type="button" 
                            className="remove-img-btn"
                            onClick={() => removeNewImage(idx)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Existing Images for Edit */}
                {editingProduct && existingImages.length > 0 && (
                  <div className="existing-images">
                    <div className="preview-header">
                      <i className="ri-gallery-line"></i>
                      <span>Current Images ({existingImages.length})</span>
                    </div>
                    <div className="previews-grid">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="preview-item">
                          <img src={getImageUrl(img)} alt={`Existing ${idx + 1}`} />
                          <button 
                            type="button" 
                            className="remove-img-btn"
                            onClick={() => removeExistingImage(idx)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <label className="section-label"><i className="ri-information-line"></i> Basic Information</label>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Name (English) <span className="required">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Name (Amharic)</label>
                    <input type="text" name="nameAm" value={formData.nameAm} onChange={handleInputChange} />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category <span className="required">*</span></label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Price (ETB) <span className="required">*</span></label>
                    <input type="number" name="price" step="0.01" value={formData.price} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Stock <span className="required">*</span></label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <select name="unit" value={formData.unit} onChange={handleInputChange}>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="liter">Liter (L)</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="form-section">
                <label className="section-label"><i className="ri-file-text-line"></i> Descriptions</label>
                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>Description (Amharic)</label>
                  <textarea name="descriptionAm" value={formData.descriptionAm} onChange={handleInputChange} rows="3"></textarea>
                </div>
              </div>

              {/* Seller & Status */}
              <div className="form-section">
                <label className="section-label"><i className="ri-store-line"></i> Seller Information</label>
                <div className="form-row">
                  <div className="form-group">
                    <label>Seller/Farmer</label>
                    <input type="text" name="seller" value={formData.seller} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  <i className="ri-close-line"></i> Cancel
                </button>
                <button type="submit" className="btn-save" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line ri-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i> Save Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;