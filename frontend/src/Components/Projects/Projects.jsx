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

  const getImageUrl = (project) => {
    if (project.imageUrl) return project.imageUrl;
    if (project.image) return `${API_URL}${project.image}`;
    return null;
  };

  const translations = {
    en: {
      title: 'Projects',
      subtitle: 'Browse our premium projects',
      price: 'Price',
      locked: 'Locked',
      unlock: 'Unlock',
      noProjects: 'No projects available',
      comingSoon: 'More projects coming soon'
    },
    am: {
      title: 'ፕሮጀክቶች',
      subtitle: 'የእኛን ፕሪሚየም ፕሮጀክቶች ይመልከቱ',
      price: 'ዋጋ',
      locked: 'ተቆልፏል',
      unlock: 'ክፈት',
      noProjects: 'ምንም ፕሮጀክቶች የሉም',
      comingSoon: 'ተጨማሪ ፕሮጀክቶች በቅርቡ'
    }
  };

  const t = translations[language];

  if (loading) {
    return <div className="projects-loading"><i className="ri-loader-4-line ri-spin"></i><p>Loading...</p></div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <i className="ri-folder-line"></i>
          <h3>{t.noProjects}</h3>
          <p>{t.comingSoon}</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => {
            const imageUrl = getImageUrl(project);
            return (
              <div key={project._id} className="project-card">
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
                  <p>{language === 'en' ? project.description : (project.descriptionAm || project.description)}</p>
                  <div className="project-price">${project.price}</div>
                  <button className="unlock-btn">
                    <i className="ri-lock-unlock-line"></i> {t.unlock}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
