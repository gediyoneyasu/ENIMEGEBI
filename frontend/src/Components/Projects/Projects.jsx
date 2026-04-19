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
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
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

  const handlePurchase = async (project) => {
    const token = localStorage.getItem('enimegebiToken');
    if (!token) {
      alert('Please login first');
      window.location.href = '/auth';
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/projects/purchase`, {
        projectId: project._id,
        amount: project.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Purchase request sent! Admin will approve after payment verification.');
        fetchProjects();
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to process purchase');
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
      price: 'Price',
      unlock: 'Unlock Project',
      locked: 'Locked',
      view: 'View Project',
      noProjects: 'No projects available',
      comingSoon: 'More projects coming soon',
      purchase: 'Purchase',
      pending: 'Pending Approval'
    },
    am: {
      title: 'ፕሮጀክቶች',
      subtitle: 'የእኛን ፕሪሚየም ፕሮጀክቶች ይመልከቱ',
      price: 'ዋጋ',
      unlock: 'ፕሮጀክት ክፈት',
      locked: 'ተቆልፏል',
      view: 'ፕሮጀክት ይመልከቱ',
      noProjects: 'ምንም ፕሮጀክቶች የሉም',
      comingSoon: 'ተጨማሪ ፕሮጀክቶች በቅርቡ',
      purchase: 'ግዛ',
      pending: 'በመጠባበቅ ላይ'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="projects-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <i className="ri-folder-image-line"></i>
          <h3>{t.noProjects}</h3>
          <p>{t.comingSoon}</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-image">
                {getImageUrl(project.image) ? (
                  <img src={getImageUrl(project.image)} alt={project.title} />
                ) : (
                  <div className="no-image-placeholder">
                    <i className="ri-image-line"></i>
                  </div>
                )}
                {project.status === 'locked' && (
                  <div className="locked-overlay">
                    <i className="ri-lock-line"></i>
                    <span>{t.locked}</span>
                  </div>
                )}
              </div>
              <div className="project-details">
                <h3>{language === 'en' ? project.title : (project.titleAm || project.title)}</h3>
                <p>{language === 'en' ? project.description : (project.descriptionAm || project.description)}</p>
                <div className="project-price">${project.price}</div>
                {project.status === 'locked' ? (
                  <button className="unlock-btn" onClick={() => handlePurchase(project)}>
                    <i className="ri-lock-unlock-line"></i> {t.unlock} - ${project.price}
                  </button>
                ) : (
                  <Link to={`/projects/${project._id}`} className="view-btn">
                    <i className="ri-eye-line"></i> {t.view}
                  </Link>
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
