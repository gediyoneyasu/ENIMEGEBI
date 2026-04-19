import React, { useState, useEffect } from 'react';
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
      console.log('Projects response:', response.data);
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Projects',
      subtitle: 'Access premium projects and resources',
      price: 'Price',
      unlock: 'Unlock Project',
      locked: 'Locked',
      view: 'View Project',
      noProjects: 'No projects available',
      comingSoon: 'More projects coming soon'
    },
    am: {
      title: 'ፕሮጀክቶች',
      subtitle: 'ፕሪሚየም ፕሮጀክቶችን እና ሀብቶችን ይድረሱ',
      price: 'ዋጋ',
      unlock: 'ፕሮጀክት ክፈት',
      locked: 'ተቆልፏል',
      view: 'ፕሮጀክት ይመልከቱ',
      noProjects: 'ምንም ፕሮጀክቶች የሉም',
      comingSoon: 'ተጨማሪ ፕሮጀክቶች በቅርቡ'
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
          <i className="ri-folder-line"></i>
          <h3>{t.noProjects}</h3>
          <p>{t.comingSoon}</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-card-image">
                {project.image && (
                  <img src={`${API_URL}${project.image}`} alt={project.title} />
                )}
                {project.status === 'locked' && (
                  <div className="locked-badge">
                    <i className="ri-lock-line"></i>
                    <span>{t.locked}</span>
                  </div>
                )}
              </div>
              <div className="project-card-content">
                <h3>{language === 'en' ? project.title : (project.titleAm || project.title)}</h3>
                <p>{language === 'en' ? project.description : (project.descriptionAm || project.description)}</p>
                <div className="project-price">${project.price}</div>
                <button className="unlock-project-btn">
                  <i className="ri-lock-unlock-line"></i> {t.unlock}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
