import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import './Projects.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const Projects = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchMyProjects();
    
    // Check for payment return
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      alert('Payment successful! Your project is now unlocked.');
      window.history.replaceState({}, document.title, '/projects');
      fetchMyProjects();
    } else if (paymentStatus === 'failed') {
      alert('Payment failed. Please try again.');
      window.history.replaceState({}, document.title, '/projects');
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/public`);
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      if (token) {
        const response = await axios.get(`${API_URL}/api/projects/my-projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setMyProjects(response.data.projects);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getImageUrl = (project) => {
    if (project.imageUrl) return project.imageUrl;
    if (project.image && project.image.startsWith('/uploads')) return `${API_URL}${project.image}`;
    if (project.image) {
      if (project.image.startsWith('http')) return project.image;
      return `${API_URL}${project.image}`;
    }
    return null;
  };

  const handleChapaPayment = async (project) => {
    const token = localStorage.getItem('enimegebiToken');
    if (!token) {
      alert('Please login first');
      window.location.href = '/auth';
      return;
    }

    setProcessingPayment(true);
    const user = JSON.parse(localStorage.getItem('enimegebiUser'));

    try {
      const response = await axios.post(`${API_URL}/api/payment/initialize-project`, {
        projectId: project._id,
        amount: project.price,
        email: user.email,
        name: user.name,
        phone: user.phone || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        window.location.href = response.data.checkout_url;
      } else {
        alert(response.data.message || 'Payment initialization failed');
        setProcessingPayment(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Failed to process payment');
      setProcessingPayment(false);
    }
  };

  const showProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const translations = {
    en: {
      title: 'Projects',
      subtitle: 'Browse our premium projects and resources',
      allProjects: 'All Projects',
      myProjects: 'My Projects',
      price: 'Price',
      unlock: 'Unlock with Chapa',
      locked: 'Locked',
      view: 'View Details',
      noProjects: 'No projects available',
      myProjectsEmpty: "You haven't purchased any projects yet",
      description: 'Description',
      purchaseRequest: 'Pay with Chapa',
      close: 'Close',
      processing: 'Processing...'
    },
    am: {
      title: 'ፕሮጀክቶች',
      subtitle: 'የእኛን ፕሪሚየም ፕሮጀክቶች ይመልከቱ',
      allProjects: 'ሁሉም ፕሮጀክቶች',
      myProjects: 'የኔ ፕሮጀክቶች',
      price: 'ዋጋ',
      unlock: 'በቻፓ ክፈት',
      locked: 'ተቆልፏል',
      view: 'ዝርዝር',
      noProjects: 'ምንም ፕሮጀክቶች የሉም',
      myProjectsEmpty: 'እስካሁን ምንም ፕሮጀክት አልገዙም',
      description: 'መግለጫ',
      purchaseRequest: 'በቻፓ ክፈል',
      close: 'ዝጋ',
      processing: 'በሂደት ላይ...'
    }
  };

  const t = translations[language];
  const displayProjects = activeTab === 'all' ? projects : myProjects;

  if (loading) {
    return <div className="projects-loading"><i className="ri-loader-4-line ri-spin"></i><p>Loading...</p></div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="projects-tabs">
        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          {t.allProjects}
        </button>
        <button className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
          {t.myProjects}
        </button>
      </div>

      {displayProjects.length === 0 ? (
        <div className="no-projects">
          <i className="ri-folder-line"></i>
          <h3>{activeTab === 'all' ? t.noProjects : t.myProjectsEmpty}</h3>
        </div>
      ) : (
        <div className="projects-grid">
          {displayProjects.map(project => {
            const imageUrl = getImageUrl(project);
            return (
              <div key={project._id} className="project-card" onClick={() => showProjectDetails(project)}>
                <div className="project-image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={project.title} />
                  ) : (
                    <div className="no-image"><i className="ri-image-line"></i></div>
                  )}
                  {project.status === 'locked' && (
                    <div className="locked-badge">
                      <i className="ri-lock-line"></i>
                      <span>{t.locked}</span>
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <h3>{language === 'en' ? project.title : (project.titleAm || project.title)}</h3>
                  <p>{language === 'en' ? project.description?.substring(0, 80) : (project.descriptionAm || project.description)?.substring(0, 80)}...</p>
                  <div className="project-price">${project.price}</div>
                  <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); showProjectDetails(project); }}>
                    <i className="ri-eye-line"></i> {t.view}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{language === 'en' ? selectedProject.title : (selectedProject.titleAm || selectedProject.title)}</h2>
              <button className="close-modal" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="modal-image">
                {getImageUrl(selectedProject) ? (
                  <img src={getImageUrl(selectedProject)} alt={selectedProject.title} />
                ) : (
                  <div className="no-image"><i className="ri-image-line"></i></div>
                )}
              </div>
              <div className="modal-info">
                <p><strong>{t.description}:</strong></p>
                <p>{language === 'en' ? selectedProject.description : (selectedProject.descriptionAm || selectedProject.description)}</p>
                <p><strong>{t.price}:</strong> ${selectedProject.price}</p>
                {selectedProject.status === 'locked' ? (
                  <button className="purchase-btn" onClick={() => handleChapaPayment(selectedProject)} disabled={processingPayment}>
                    {processingPayment ? t.processing : t.purchaseRequest}
                  </button>
                ) : (
                  <div className="project-content-preview">
                    <p>✅ You have access to this project!</p>
                    {selectedProject.fileType === 'pdf' && selectedProject.fileUrl && (
                      <a href={selectedProject.fileUrl} target="_blank" rel="noopener noreferrer" className="view-file-btn">
                        <i className="ri-file-pdf-line"></i> View PDF
                      </a>
                    )}
                    {selectedProject.fileType === 'video' && selectedProject.fileUrl && (
                      <video controls src={selectedProject.fileUrl} style={{ width: '100%', marginTop: '10px' }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
