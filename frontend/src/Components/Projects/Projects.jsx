import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import './Projects.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const Projects = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myProjects, setMyProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchProjects();
    fetchMyProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/public`);
      if (response.data.success) setProjects(response.data.projects);
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
        if (response.data.success) setMyProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChapaPayment = async (project) => {
    const token = localStorage.getItem('enimegebiToken');
    if (!token) {
      alert('Please login first');
      window.location.href = '/auth';
      return;
    }

    const userData = localStorage.getItem('enimegebiUser');
    const user = JSON.parse(userData);
    
    try {
      console.log('Initiating payment for project:', project._id);
      
      const response = await axios.post(`${API_URL}/api/payment/initialize-project`, {
        projectId: project._id,
        amount: project.price,
        email: user.email,
        name: user.name,
        phone: user.phone || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Payment response:', response.data);

      if (response.data.success) {
        window.location.href = response.data.checkout_url;
      } else {
        alert(response.data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Failed to process payment');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
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
      view: 'View Project',
      noProjects: 'No projects available',
      myProjectsEmpty: 'You haven\'t purchased any projects yet'
    },
    am: {
      title: 'ፕሮጀክቶች',
      subtitle: 'የእኛን ፕሪሚየም ፕሮጀክቶች ይመልከቱ',
      allProjects: 'ሁሉም ፕሮጀክቶች',
      myProjects: 'የኔ ፕሮጀክቶች',
      price: 'ዋጋ',
      unlock: 'በቻፓ ክፈት',
      locked: 'ተቆልፏል',
      view: 'ፕሮጀክት ይመልከቱ',
      noProjects: 'ምንም ፕሮጀክቶች የሉም',
      myProjectsEmpty: 'እስካሁን ምንም ፕሮጀክት አልገዙም'
    }
  };

  const t = translations[language];
  const displayProjects = activeTab === 'all' ? projects : myProjects;

  if (loading) return <div className="projects-loading"><i className="ri-loader-4-line ri-spin"></i><p>Loading...</p></div>;

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="projects-tabs">
        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>{t.allProjects}</button>
        <button className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>{t.myProjects}</button>
      </div>

      {displayProjects.length === 0 ? (
        <div className="no-projects">
          <i className="ri-folder-image-line"></i>
          <h3>{activeTab === 'all' ? t.noProjects : t.myProjectsEmpty}</h3>
        </div>
      ) : (
        <div className="projects-grid">
          {displayProjects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-image">
                {getImageUrl(project.image || project.fileUrl) ? (
                  <img src={getImageUrl(project.image || project.fileUrl)} alt={project.title} />
                ) : (
                  <div className="no-image-placeholder"><i className="ri-image-line"></i></div>
                )}
                {project.status === 'locked' && !project.isUnlocked && (
                  <div className="locked-overlay"><i className="ri-lock-line"></i><span>{t.locked}</span></div>
                )}
              </div>
              <div className="project-details">
                <h3>{language === 'en' ? project.title : (project.titleAm || project.title)}</h3>
                <p>{language === 'en' ? project.description : (project.descriptionAm || project.description)}</p>
                <div className="project-price">${project.price}</div>
                {activeTab === 'my' || project.isUnlocked ? (
                  <Link to={`/projects/${project._id}`} className="view-btn"><i className="ri-eye-line"></i> {t.view}</Link>
                ) : (
                  <button className="unlock-btn" onClick={() => handleChapaPayment(project)}>
                    <i className="ri-lock-unlock-line"></i> {t.unlock} - ${project.price}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
