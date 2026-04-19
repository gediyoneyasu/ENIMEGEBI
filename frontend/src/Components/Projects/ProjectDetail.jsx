import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import './Projects.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const ProjectDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get(`${API_URL}/api/projects/public/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        setProject(response.data.project);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Project not found');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!project) return null;
    
    switch (project.contentType) {
      case 'youtube':
        return (
          <div className="project-video-container">
            <iframe
              src={`https://www.youtube.com/embed/${project.youtubeId}`}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'pdf':
        return (
          <div className="project-pdf-container">
            <iframe
              src={project.pdfUrl}
              title={project.title}
              width="100%"
              height="600px"
            ></iframe>
          </div>
        );
      case 'video':
        return (
          <div className="project-video-container">
            <video controls width="100%">
              <source src={project.contentUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'link':
        return (
          <div className="project-link-container">
            <a href={project.contentUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              {project.contentUrl}
            </a>
          </div>
        );
      case 'image':
      default:
        return (
          <div className="project-image-container">
            <img src={`${API_URL}${project.image}`} alt={project.title} />
          </div>
        );
    }
  };

  const translations = {
    en: {
      back: 'Back to Projects',
      locked: 'This project is locked',
      unlock: 'Unlock for $',
      description: 'Description',
      content: 'Project Content'
    },
    am: {
      back: 'ወደ ፕሮጀክቶች ተመለስ',
      locked: 'ይህ ፕሮጀክት ተቆልፏል',
      unlock: 'ክፈት ለ $',
      description: 'መግለጫ',
      content: 'የፕሮጀክት ይዘት'
    }
  };

  const t = translations[language];

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!project) return <div className="error-message">Project not found</div>;

  return (
    <div className="project-detail-page">
      <button className="back-btn" onClick={() => navigate('/projects')}>
        <i className="ri-arrow-left-line"></i> {t.back}
      </button>

      <div className="project-detail-header">
        <h1>{language === 'en' ? project.title : (project.titleAm || project.title)}</h1>
        <p>{language === 'en' ? project.description : (project.descriptionAm || project.description)}</p>
      </div>

      {project.status === 'locked' ? (
        <div className="project-locked-message">
          <i className="ri-lock-line"></i>
          <h2>{t.locked}</h2>
          <p>{t.unlock}{project.price}</p>
          <button className="purchase-btn" onClick={() => alert('Contact admin for payment')}>
            {t.unlock} ${project.price}
          </button>
        </div>
      ) : (
        <div className="project-content">
          <h3>{t.content}</h3>
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
