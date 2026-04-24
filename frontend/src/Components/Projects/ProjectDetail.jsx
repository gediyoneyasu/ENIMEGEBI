import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../main';
import getImageUrl from '../../utils/imageHelper';
import './Projects.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

const ProjectDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

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
    
    switch (project.fileType) {
      case 'youtube':
        return (
          <div className="project-content-viewer">
            <iframe
              src={`https://www.youtube.com/embed/${project.youtubeId || ''}`}
              title={project.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'pdf':
        return (
          <div className="project-content-viewer">
            <iframe
              src={`${getImageUrl(project.fileUrl)}#toolbar=0`}
              title={project.title}
              width="100%"
              height="600px"
            ></iframe>
          </div>
        );
      case 'video':
        return (
          <div className="project-content-viewer">
            <video controls width="100%">
              <source src={getImageUrl(project.fileUrl)} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'image':
      default:
        return (
          <div className="project-content-viewer">
            <img src={getImageUrl(project.fileUrl || project.imageUrl || project.image)} alt={project.title} />
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

  const handleChapaPayment = async () => {
    const token = localStorage.getItem('enimegebiToken');
    if (!token) {
      navigate('/auth');
      return;
    }

    const user = JSON.parse(localStorage.getItem('enimegebiUser') || '{}');
    setProcessingPayment(true);
    setError('');

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

      if (response.data.success && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        setError(response.data.message || 'Payment initialization failed');
        setProcessingPayment(false);
      }
    } catch (paymentError) {
      setError(paymentError.response?.data?.message || 'Failed to process payment');
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const txRef = urlParams.get('tx_ref');

    const verifyReturnedPayment = async () => {
      if (!txRef || paymentStatus !== 'pending') return;
      try {
        const token = localStorage.getItem('enimegebiToken');
        const verifyResponse = await axios.get(`${API_URL}/api/payment/verify-project-status/${txRef}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (verifyResponse.data.success) {
          await fetchProject();
          window.history.replaceState({}, document.title, `/projects/${id}`);
        } else {
          setError('Payment failed or not completed.');
          window.history.replaceState({}, document.title, `/projects/${id}`);
        }
      } catch (verifyError) {
        setError(verifyError.response?.data?.message || 'Could not verify payment status.');
      }
    };

    if (paymentStatus === 'success') {
      fetchProject();
      window.history.replaceState({}, document.title, `/projects/${id}`);
    } else if (paymentStatus === 'failed') {
      setError('Payment failed. Please try again.');
      window.history.replaceState({}, document.title, `/projects/${id}`);
    } else if (paymentStatus === 'pending' && txRef) {
      verifyReturnedPayment();
    }
  }, [id]);

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
          <button className="purchase-btn" onClick={handleChapaPayment} disabled={processingPayment}>
            {processingPayment ? 'Processing...' : `${t.unlock} ${project.price}`}
          </button>
        </div>
      ) : (
        <div className="project-content-section">
          <h3>{t.content}</h3>
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
