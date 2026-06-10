import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Products.css';
import { getImageUrl } from '../../utils/imageHelper';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminLanguage, setAdminLanguage] = useState('en');
  
  // Image upload states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [urlImageInput, setUrlImageInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Unit options
  const unitOptions = [
    { value: 'kg', labelEn: 'Kilogram (kg)', labelAm: 'ኪሎግራም (ኪግ)' },
    { value: 'liter', labelEn: 'Liter (L)', labelAm: 'ሊትር (ሊ)' },
    { value: 'piece', labelEn: 'Piece (pc)', labelAm: 'ቁራጭ' },
    { value: 'box', labelEn: 'Box', labelAm: 'ሳጥን' },
    { value: 'pack', labelEn: 'Pack', labelAm: 'ጥቅል' },
    { value: 'bottle', labelEn: 'Bottle', labelAm: 'ጠርሙስ' }
  ];
  
  // Form data with both languages
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
    sellerAm: '',
    status: 'active'
  });

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('adminLanguage') || 'en';
    setAdminLanguage(savedLang);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      showAlert('error', t.errorFetch);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Image handlers
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
  };

  // FIXED: URL Image Add - Validates and adds URL images
  const handleUrlImageAdd = () => {
    if (!urlImageInput.trim()) {
      showAlert('error', t.enterUrlMsg);
      return;
    }
    
    const trimmedUrl = urlImageInput.trim();
    if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
      showAlert('error', 'Please enter a valid image URL starting with http:// or https://');
      return;
    }
    
    // Add to previews
    setImagePreviews([...imagePreviews, trimmedUrl]);
    
    const fakeFile = {
      name: `url-image-${Date.now()}.jpg`,
      isUrl: true,
      url: trimmedUrl
    };
    setImageFiles([...imageFiles, fakeFile]);
    setUrlImageInput('');
    showAlert('success', t.imageAdded);
  };

  const addImages = (files) => {
    if (files.length === 0) return;
    
    const totalImages = imageFiles.length + files.length + existingImages.length;
    if (totalImages > 10) {
      showAlert('error', t.maxImages);
      return;
    }
    
    const validFiles = [];
    const validPreviews = [];
    
    for (const file of files) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.type)) {
        if (file.size > 5 * 1024 * 1024) {
          showAlert('error', `${file.name} ${t.fileTooLarge}`);
          continue;
        }
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      } else {
        showAlert('error', `${file.name} ${t.invalidImage}`);
      }
    }
    
    if (validFiles.length > 0) {
      setImageFiles([...imageFiles, ...validFiles]);
      setImagePreviews([...imagePreviews, ...validPreviews]);
      showAlert('success', `${validFiles.length} ${t.imagesAdded}`);
    }
  };

  const removeNewImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    // Revoke blob URL to avoid memory leaks
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
  };

  const removeExistingImage = (index) => {
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0 && existingImages.length === 0 && !editingProduct) {
      showAlert('error', t.requiredImage);
      return;
    }
    
    setIsSubmitting(true);
    
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      showAlert('error', t.fillRequired);
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
      sellerAm: formData.sellerAm || '',
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

    try {
      const token = localStorage.getItem('enimegebiToken');
      
      if (editingProduct) {
        await axios.put(`${API_URL}/api/admin/products/${editingProduct._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        showAlert('success', t.updateSuccess);
      } else {
        await axios.post(`${API_URL}/api/admin/products`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        showAlert('success', t.addSuccess);
      }
      
      setTimeout(() => {
        closeModal();
        fetchProducts();
      }, 1500);
      
    } catch (error) {
      console.error('Save error:', error);
      showAlert('error', error.response?.data?.message || t.saveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        const token = localStorage.getItem('enimegebiToken');
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
        showAlert('success', t.deleteSuccess);
      } catch (error) {
        showAlert('error', t.deleteError);
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
      sellerAm: product.sellerAm || '',
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
      description: '', descriptionAm: '', unit: 'kg', seller: '', sellerAm: '', status: 'active'
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
    // Cleanup blob URLs
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

  // Get unit display text
  const getUnitLabel = (unitValue) => {
    const unit = unitOptions.find(u => u.value === unitValue);
    if (!unit) return unitValue;
    return adminLanguage === 'am' ? unit.labelAm : unit.labelEn;
  };

  // Display text based on admin's selected language
  const getDisplayName = (product) => {
    if (adminLanguage === 'am' && product.nameAm) {
      return product.nameAm;
    }
    return product.name;
  };

  const t = {
    en: {
      title: 'Products Management',
      search: 'Search products...',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      addNew: 'Add New Product',
      noProducts: 'No products found',
      productName: 'Product Name (English)',
      productNameAm: 'Product Name (Amharic)',
      category: 'Category',
      price: 'Price (ETB)',
      stock: 'Stock Quantity',
      unit: 'Unit',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      description: 'Description (English)',
      descriptionAm: 'Description (Amharic)',
      seller: 'Seller (English)',
      sellerAm: 'Seller (Amharic)',
      save: 'Save Product',
      saving: 'Saving...',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      productImages: 'Product Images',
      requiredImages: '*Required (1-10 images)',
      dragDrop: 'Drag & drop images here',
      selectImages: 'Select Images',
      enterUrl: 'Or enter image URL',
      addUrl: 'Add URL',
      images: 'Images',
      errorFetch: 'Failed to load products',
      enterUrlMsg: 'Please enter an image URL',
      imageAdded: 'Image added from URL',
      maxImages: 'Maximum 10 images allowed',
      fileTooLarge: 'is larger than 5MB',
      invalidImage: 'is not a valid image',
      imagesAdded: 'image(s) added',
      requiredImage: 'Please add at least one image for the product',
      fillRequired: 'Please fill all required fields',
      updateSuccess: 'Product updated successfully!',
      addSuccess: 'Product added successfully!',
      saveError: 'Failed to save product',
      confirmDelete: 'Are you sure you want to delete this product?',
      deleteSuccess: 'Product deleted successfully!',
      deleteError: 'Failed to delete product',
      stockLabel: 'Stock:',
      units: 'units',
      noImage: 'No Image',
      langToggle: 'English'
    },
    am: {
      title: 'የምርቶች አስተዳደር',
      search: 'ምርቶችን ይፈልጉ...',
      addProduct: 'ምርት ያክሉ',
      editProduct: 'ምርት ያርትዑ',
      addNew: 'አዲስ ምርት ያክሉ',
      noProducts: 'ምንም ምርቶች አልተገኙም',
      productName: 'የምርት ስም (እንግሊዝኛ)',
      productNameAm: 'የምርት ስም (አማርኛ)',
      category: 'ምድብ',
      price: 'ዋጋ (ብር)',
      stock: 'የክምችት ብዛት',
      unit: 'መለኪያ',
      status: 'ሁኔታ',
      active: 'ንቁ',
      inactive: 'ንቁ ያልሆነ',
      description: 'መግለጫ (እንግሊዝኛ)',
      descriptionAm: 'መግለጫ (አማርኛ)',
      seller: 'ሻጭ (እንግሊዝኛ)',
      sellerAm: 'ሻጭ (አማርኛ)',
      save: 'ምርቱን ያስቀምጡ',
      saving: 'በማስቀመጥ ላይ...',
      cancel: 'ይቅር',
      edit: 'ያርትዑ',
      delete: 'ሰርዝ',
      productImages: 'የምርት ምስሎች',
      requiredImages: '*ያስፈልጋል (1-10 ምስሎች)',
      dragDrop: 'ምስሎችን እዚህ ጎትተው ይጣሉ',
      selectImages: 'ምስሎችን ይምረጡ',
      enterUrl: 'ወይም የምስል አድራሻ ያስገቡ',
      addUrl: 'አድራሻ ያክሉ',
      images: 'ምስሎች',
      errorFetch: 'ምርቶችን ማምጣት አልተቻለም',
      enterUrlMsg: 'እባክዎ የምስል አድራሻ ያስገቡ',
      imageAdded: 'ምስል ከአድራሻ ተጨምሯል',
      maxImages: 'ከፍተኛው 10 ምስሎች ብቻ ይፈቀዳሉ',
      fileTooLarge: 'ከ5MB ይበልጣል',
      invalidImage: 'የሚሰራ ምስል አይደለም',
      imagesAdded: 'ምስል(ዎች) ተጨምረዋል',
      requiredImage: 'እባክዎ ቢያንስ አንድ ምስል ያክሉ',
      fillRequired: 'እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ',
      updateSuccess: 'ምርቱ በተሳካ ሁኔታ ተሻሽሏል!',
      addSuccess: 'ምርቱ በተሳካ ሁኔታ ተጨምሯል!',
      saveError: 'ምርቱን ማስቀመጥ አልተቻለም',
      confirmDelete: 'ይህን ምርት መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?',
      deleteSuccess: 'ምርቱ በተሳካ ሁኔታ ተሰርዟል!',
      deleteError: 'ምርቱን መሰረዝ አልተቻለም',
      stockLabel: 'ክምችት:',
      units: 'ክፍሎች',
      noImage: 'ምስል የለም',
      langToggle: 'አማርኛ'
    }
  }[adminLanguage];

  // Language toggle function
  const toggleLanguage = () => {
    const newLang = adminLanguage === 'en' ? 'am' : 'en';
    setAdminLanguage(newLang);
    localStorage.setItem('adminLanguage', newLang);
  };

  if (loading) return (
    <div className="products-loading">
      <div className="products-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="products-management">
      {/* Language Toggle Button */}
      <div className="products-lang-toggle">
        <button onClick={toggleLanguage} className="lang-toggle-btn">
          <i className={adminLanguage === 'en' ? 'ri-english-input' : 'ri-font-size'}></i>
          {t.langToggle}
        </button>
      </div>

      {alert && (
        <div className={`products-alert products-alert-${alert.type}`}>
          <i className={alert.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          <span>{alert.message}</span>
        </div>
      )}
      
      <div className="products-header">
        <h2><i className="ri-shopping-bag-3-line"></i> {t.title}</h2>
        <div className="products-header-actions">
          <div className="products-search">
            <i className="ri-search-line"></i>
            <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="products-add-btn" onClick={openModal}>
            <i className="ri-add-line"></i> {t.addProduct}
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="products-empty">
          <i className="ri-shopping-bag-line"></i>
          <h3>{t.noProducts}</h3>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={getImageUrl(product.images[0])} alt={product.name} loading="lazy" />
                ) : product.imageUrl ? (
                  <img src={getImageUrl(product.imageUrl)} alt={product.name} loading="lazy" />
                ) : (
                  <div className="product-no-image">
                    <i className="ri-image-line"></i>
                    <span>{t.noImage}</span>
                  </div>
                )}
                <span className={`product-status ${product.status}`}>
                  {product.status === 'active' ? t.active : t.inactive}
                </span>
              </div>
              <div className="product-info">
                <h3>{getDisplayName(product)}</h3>
                {adminLanguage === 'en' && product.nameAm && (
                  <p className="product-name-am">{product.nameAm}</p>
                )}
                {adminLanguage === 'am' && !product.nameAm && (
                  <p className="product-name-am">{product.name}</p>
                )}
                <span className="product-category">{product.category}</span>
                <div className="product-price">ETB {product.price?.toLocaleString()}</div>
                <div className="product-stock">
                  {t.stockLabel} {product.stock} {getUnitLabel(product.unit || 'kg')}
                </div>
                <div className="product-actions">
                  <button className="product-btn-edit" onClick={() => handleEdit(product)}>
                    <i className="ri-edit-line"></i> {t.edit}
                  </button>
                  <button className="product-btn-delete" onClick={() => handleDelete(product._id)}>
                    <i className="ri-delete-bin-line"></i> {t.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="products-modal-overlay" onClick={closeModal}>
          <div className="products-modal" onClick={(e) => e.stopPropagation()}>
            <div className="products-modal-header">
              <h3>
                <i className={editingProduct ? "ri-edit-line" : "ri-add-line"}></i>
                {editingProduct ? t.editProduct : t.addNew}
              </h3>
              <button className="products-modal-close" onClick={closeModal}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="products-form">
              <div className="products-form-section">
                <label className="products-section-label">
                  <i className="ri-image-line"></i> {t.productImages}
                  <span className="required-label">{t.requiredImages}</span>
                </label>
                
                <div className={`products-drag-drop ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver} 
                  onDragLeave={handleDragLeave} 
                  onDrop={handleDrop}
                >
                  <i className="ri-upload-cloud-2-line"></i>
                  <p>{t.dragDrop}</p>
                  <div className="products-upload-buttons">
                    <label className="products-upload-btn">
                      <i className="ri-folder-image-line"></i> {t.selectImages}
                      <input type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: 'none' }} ref={fileInputRef} />
                    </label>
                  </div>
                </div>
                
                <div className="products-url-input">
                  <input 
                    type="text" 
                    placeholder={t.enterUrl} 
                    value={urlImageInput} 
                    onChange={(e) => setUrlImageInput(e.target.value)} 
                  />
                  <button type="button" className="products-add-url-btn" onClick={handleUrlImageAdd}>
                    <i className="ri-link"></i> {t.addUrl}
                  </button>
                </div>
                
                {(imagePreviews.length > 0 || existingImages.length > 0) && (
                  <div className="products-previews">
                    <div className="products-previews-header">
                      <span>{t.images} ({imagePreviews.length + existingImages.length} / 10)</span>
                    </div>
                    <div className="products-previews-grid">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="products-preview-item">
                          <img src={getImageUrl(img)} alt={`Existing ${idx + 1}`} />
                          <button type="button" className="products-remove-img" onClick={() => removeExistingImage(idx)}>
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ))}
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="products-preview-item">
                          <img src={preview} alt={`Preview ${idx + 1}`} />
                          <button type="button" className="products-remove-img" onClick={() => removeNewImage(idx)}>
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="products-form-row">
                <div className="products-form-group">
                  <label>{t.productName} <span className="required">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="products-form-group">
                  <label>{t.productNameAm}</label>
                  <input type="text" name="nameAm" value={formData.nameAm} onChange={handleInputChange} />
                </div>
              </div>

              <div className="products-form-row">
                <div className="products-form-group">
                  <label>{t.category} <span className="required">*</span></label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
                </div>
                <div className="products-form-group">
                  <label>{t.price} <span className="required">*</span></label>
                  <input type="number" name="price" step="0.01" value={formData.price} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="products-form-row">
                <div className="products-form-group">
                  <label>{t.stock} <span className="required">*</span></label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                </div>
                <div className="products-form-group">
                  <label>{t.unit}</label>
                  <select name="unit" value={formData.unit} onChange={handleInputChange}>
                    {unitOptions.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {adminLanguage === 'am' ? unit.labelAm : unit.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="products-form-group">
                <label>{t.status}</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
              </div>

              <div className="products-form-group">
                <label>{t.description}</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder={t.description}></textarea>
              </div>

              <div className="products-form-group">
                <label>{t.descriptionAm}</label>
                <textarea name="descriptionAm" value={formData.descriptionAm} onChange={handleInputChange} rows="3" placeholder={t.descriptionAm}></textarea>
              </div>

              <div className="products-form-row">
                <div className="products-form-group">
                  <label>{t.seller}</label>
                  <input type="text" name="seller" value={formData.seller} onChange={handleInputChange} />
                </div>
                <div className="products-form-group">
                  <label>{t.sellerAm}</label>
                  <input type="text" name="sellerAm" value={formData.sellerAm} onChange={handleInputChange} />
                </div>
              </div>

              <div className="products-form-actions">
                <button type="button" className="products-btn-cancel" onClick={closeModal}>
                  {t.cancel}
                </button>
                <button type="submit" className="products-btn-save" disabled={isSubmitting}>
                  {isSubmitting ? t.saving : t.save}
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
