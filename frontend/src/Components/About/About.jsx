import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../main';
import axios from 'axios';
import './About.css';

const API_URL = 'https://enimegebi-backend.onrender.com';

function About() {
  const { language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/team/public`);
      if (response.data.success) {
        setTeamMembers(response.data.team);
      } else {
        setFallbackTeam();
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setFallbackTeam();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackTeam = () => {
    setTeamMembers([
      { 
        id: 1, 
        name: 'Gediyon Eyasu', 
        nameAm: 'ጌዲዮን ኢያሱ', 
        role: 'Co-Founder & CEO', 
        roleAm: 'ተባባሪ መሥራች እና ዋና ሥራ አስፈጻሚ', 
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        bio: 'Passionate about connecting Ethiopian businesses to the digital marketplace',
        bioAm: 'የኢትዮጵያ ንግዶችን ከዲጂታል ገበያ ጋር በማገናኘት ላይ ያለ ቁርጠኝነት'
      },
      { 
        id: 2, 
        name: 'Bereket Gelane', 
        nameAm: 'በረከት ገላኔ', 
        role: 'Co-Founder & CTO', 
        roleAm: 'ተባባሪ መሥራች እና ዋና ቴክኖሎጂ ኃላፊ', 
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        bio: 'Building innovative tech solutions for Ethiopian e-commerce',
        bioAm: 'ለኢትዮጵያ ኢ-ኮሜርስ አዳዲስ የቴክኖሎጂ መፍትሄዎችን መገንባት'
      }
    ]);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  const translations = {
    en: {
      title: 'About E-MARKATO',
      subtitle: 'Your Trusted Ethiopian Online Marketplace',
      ourStory: 'Our Story',
      storyTitle: 'SHOP SMART • SHOP LOCAL',
      storyText1: 'E-MARKATO was born from a simple idea: create a trusted marketplace where Ethiopians can buy and sell products easily and securely.',
      storyText2: 'What started as a vision to support local businesses has grown into a comprehensive marketplace offering everything from electronics to agricultural products.',
      storyText3: 'Our platform bridges the gap between traditional commerce and modern e-commerce, empowering local entrepreneurs and making online shopping accessible to every Ethiopian.',
      mission: 'Our Mission',
      missionText: 'To connect Ethiopian buyers and sellers through a reliable, easy-to-use online marketplace that promotes local businesses and provides quality products at competitive prices.',
      vision: 'Our Vision',
      visionText: 'To become Ethiopia\'s leading e-commerce platform, empowering local entrepreneurs and making online shopping accessible to every Ethiopian.',
      values: 'Our Values',
      value1: 'Trust & Security',
      value1Desc: 'Safe and secure transactions for all users',
      value2: 'Support Local',
      value2Desc: 'Empowering Ethiopian businesses directly',
      value3: 'Fast Delivery',
      value3Desc: 'Quick and reliable delivery across Ethiopia',
      value4: '24/7 Support',
      value4Desc: 'We are here to help you anytime',
      stats: 'Our Impact',
      sellers: 'Active Sellers',
      sellersCount: '500+',
      customers: 'Happy Customers',
      customersCount: '10,000+',
      products: 'Products Sold',
      productsCount: '50,000+',
      cities: 'Cities Served',
      citiesCount: '15+',
      team: 'Meet Our Team',
      teamTitle: 'The People Behind E-MARKATO',
      teamDesc: 'Passionate individuals working to revolutionize Ethiopia\'s e-commerce landscape.',
      joinUs: 'Join Our Mission',
      joinTitle: 'Become Part of the E-MARKATO Family',
      joinText: 'Whether you\'re a seller, buyer, or partner, there\'s a place for you in our growing community.',
      partnerBtn: 'Become a Seller',
      contactBtn: 'Contact Us',
      ctaTitle: 'Ready to Start Shopping?',
      ctaSubtitle: 'Join thousands of satisfied customers who trust E-MARKATO for their shopping needs.',
      shopNow: 'Shop Now',
      freeShipping: 'Free Shipping',
      bestPrices: 'Best Prices',
      securePayment: 'Secure Payment'
    },
    am: {
      title: 'ስለ ኢ-ማርካቶ',
      subtitle: 'የእርስዎ ታማኝ የኢትዮጵያ የመስመር ላይ ገበያ',
      ourStory: 'ታሪካችን',
      storyTitle: 'ስማርት ይግዙ • አገር በቀል ይግዙ',
      storyText1: 'ኢ-ማርካቶ የተወለደው ኢትዮጵያውያን በቀላሉ እና በደህና ምርቶችን መግዛት እና መሸጥ የሚችሉበት አስተማማኝ ገበያ ከሚል ቀላል ሀሳብ ነው።',
      storyText2: 'የአካባቢ ንግዶችን ለመደገፍ ባለው ራዕይ በመነሳት፣ ከኤሌክትሮኒክስ እስከ ግብርና ምርቶች ድረስ ሁሉን አቀፍ የገበያ ቦታ ሆነን አድገናል።',
      storyText3: 'የእኛ መድረክ በባህላዊ ንግድ እና በዘመናዊ ኢ-ኮሜርስ መካከል ያለውን ልዩነት ያስተካክላል፣ የአካባቢ ሥራ ፈጣሪዎችን በማብቃት እና የመስመር ላይ ግብይት ለኢትዮጵያውያን ሁሉ ተደራሽ ያደርጋል።',
      mission: 'ተልዕኮአችን',
      missionText: 'ኢትዮጵያውያን ገዢዎችን እና ሻጮችን አስተማማኝ፣ ለአጠቃቀም ቀላል በሆነ የመስመር ላይ ገበያ ለማገናኘት፣ የአካባቢ ንግዶችን ለማስተዋወቅ እና ጥራት ያላቸውን ምርቶች በተመጣጣኝ ዋጋ ለማቅረብ።',
      vision: 'ራዕያችን',
      visionText: 'የኢትዮጵያ መሪ የኢ-ኮሜርስ መድረክ ለመሆን፣ የአካባቢ ሥራ ፈጣሪዎችን ማብቃት እና የመስመር ላይ ግብይት ለኢትዮጵያውያን ሁሉ ተደራሽ ማድረግ።',
      values: 'እሴቶቻችን',
      value1: 'መተማመን እና ደህንነት',
      value1Desc: 'ደህንነቱ የተጠበቀ እና አስተማማኝ ግብይቶች',
      value2: 'የአካባቢ ድጋፍ',
      value2Desc: 'የኢትዮጵያ ንግዶችን በቀጥታ ማብቃት',
      value3: 'ፈጣን አቅርቦት',
      value3Desc: 'ፈጣን እና አስተማማኝ አቅርቦት በመላ ኢትዮጵያ',
      value4: '24/7 ድጋፍ',
      value4Desc: 'በማንኛውም ሰዓት እርዳታ ለማግኘት',
      stats: 'ተጽኖአችን',
      sellers: 'ንቁ ሻጮች',
      sellersCount: '500+',
      customers: 'ደስተኛ ደንበኞች',
      customersCount: '10,000+',
      products: 'የተሸጡ ምርቶች',
      productsCount: '50,000+',
      cities: 'የምናገለግላቸው ከተሞች',
      citiesCount: '15+',
      team: 'ቡድናችንን ይገናኙ',
      teamTitle: 'ከኢ-ማርካቶ በስተጀርባ ያሉ ሰዎች',
      teamDesc: 'የኢትዮጵያን የኢ-ኮሜርስ መልክዓ ምድር ለማሻሻል የሚሰሩ ተመራማሪ ግለሰቦች።',
      joinUs: 'ተልዕኮአችን ይቀላቀሉ',
      joinTitle: 'የኢ-ማርካቶ ቤተሰብ አካል ይሁኑ',
      joinText: 'ሻጭ፣ ገዢ ወይም አጋር ቢሆኑ፣ በማደግ ላይ ባለው ማህበረሰባችን ውስጥ ቦታ አለዎት።',
      partnerBtn: 'ሻጭ ይሁኑ',
      contactBtn: 'ያግኙን',
      ctaTitle: 'ለመግዛት ዝግጁ ነዎት?',
      ctaSubtitle: 'ለግዢ ፍላጎቶቻቸው ኢ-ማርካቶን ከሚተማመኑ በሺዎች ከሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ።',
      shopNow: 'አሁን ይግዙ',
      freeShipping: 'ነጻ አቅርቦት',
      bestPrices: 'ምርጥ ዋጋዎች',
      securePayment: 'ደህንነቱ የተጠበቀ ክፍያ'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="ae-loading-about">
        <div className="ae-loading-spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  return (
    <div className="ae-about-page">
      {/* Hero Section */}
      <div className="ae-about-hero">
        <div className="ae-about-hero-content">
          <div className="ae-hero-badge">SHOP SMART • SHOP LOCAL</div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className="ae-about-container">
        {/* Our Story Section */}
        <div className="ae-story-section">
          <div className="ae-story-content">
            <div className="ae-story-icon">
              <i className="ri-history-line"></i>
            </div>
            <h2>{t.storyTitle}</h2>
            <p>{t.storyText1}</p>
            <p>{t.storyText2}</p>
            <p>{t.storyText3}</p>
          </div>
          <div className="ae-story-image">
            <div className="ae-story-placeholder">
              <i className="ri-store-3-line"></i>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="ae-mission-vision">
          <div className="ae-mission-card">
            <div className="ae-mission-icon">
              <i className="ri-rocket-line"></i>
            </div>
            <h3>{t.mission}</h3>
            <p>{t.missionText}</p>
          </div>
          <div className="ae-vision-card">
            <div className="ae-vision-icon">
              <i className="ri-eye-line"></i>
            </div>
            <h3>{t.vision}</h3>
            <p>{t.visionText}</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="ae-values-section">
          <h2 className="ae-values-title">{t.values}</h2>
          <div className="ae-values-grid">
            <div className="ae-value-card">
              <div className="ae-value-icon">
                <i className="ri-shield-check-line"></i>
              </div>
              <h3>{t.value1}</h3>
              <p>{t.value1Desc}</p>
            </div>
            <div className="ae-value-card">
              <div className="ae-value-icon">
                <i className="ri-store-line"></i>
              </div>
              <h3>{t.value2}</h3>
              <p>{t.value2Desc}</p>
            </div>
            <div className="ae-value-card">
              <div className="ae-value-icon">
                <i className="ri-truck-line"></i>
              </div>
              <h3>{t.value3}</h3>
              <p>{t.value3Desc}</p>
            </div>
            <div className="ae-value-card">
              <div className="ae-value-icon">
                <i className="ri-customer-service-line"></i>
              </div>
              <h3>{t.value4}</h3>
              <p>{t.value4Desc}</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="ae-stats-section">
          <h2 className="ae-stats-title">{t.stats}</h2>
          <div className="ae-stats-grid">
            <div className="ae-stat-card">
              <div className="ae-stat-icon">
                <i className="ri-store-2-line"></i>
              </div>
              <div className="ae-stat-number">{t.sellersCount}</div>
              <div className="ae-stat-label">{t.sellers}</div>
            </div>
            <div className="ae-stat-card">
              <div className="ae-stat-icon">
                <i className="ri-user-heart-line"></i>
              </div>
              <div className="ae-stat-number">{t.customersCount}</div>
              <div className="ae-stat-label">{t.customers}</div>
            </div>
            <div className="ae-stat-card">
              <div className="ae-stat-icon">
                <i className="ri-shopping-bag-line"></i>
              </div>
              <div className="ae-stat-number">{t.productsCount}</div>
              <div className="ae-stat-label">{t.products}</div>
            </div>
            <div className="ae-stat-card">
              <div className="ae-stat-icon">
                <i className="ri-map-pin-line"></i>
              </div>
              <div className="ae-stat-number">{t.citiesCount}</div>
              <div className="ae-stat-label">{t.cities}</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="ae-team-section">
          <small className="ae-team-subtitle">{t.team}</small>
          <h2 className="ae-team-title">{t.teamTitle}</h2>
          <p className="ae-team-desc">{t.teamDesc}</p>
          
          <div className="ae-team-grid">
            {teamMembers.map((member) => (
              <div key={member._id || member.id} className="ae-team-card">
                <div className="ae-team-avatar">
                  <img src={getImageUrl(member.image)} alt={member.name} />
                </div>
                <div className="ae-team-info">
                  <h3>{language === 'en' ? member.name : (member.nameAm || member.name)}</h3>
                  <p className="ae-team-role">{language === 'en' ? member.role : (member.roleAm || member.role)}</p>
                  <div className="ae-team-bio">
                    <i className="ri-double-quotes-l"></i>
                    <p>{language === 'en' ? member.bio : (member.bioAm || member.bio)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Section */}
        <div className="ae-join-section">
          <div className="ae-join-content">
            <h2>{t.joinTitle}</h2>
            <p>{t.joinText}</p>
            <div className="ae-join-buttons">
              <Link to="/auth" className="ae-join-btn">{t.partnerBtn}</Link>
              <Link to="/contact" className="ae-contact-btn">{t.contactBtn}</Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="ae-cta-section">
          <div className="ae-cta-content">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSubtitle}</p>
            <div className="ae-cta-features">
              <span><i className="ri-truck-line"></i> {t.freeShipping}</span>
              <span><i className="ri-price-tag-line"></i> {t.bestPrices}</span>
              <span><i className="ri-shield-check-line"></i> {t.securePayment}</span>
            </div>
            <Link to="/products" className="ae-cta-btn">{t.shopNow} <i className="ri-arrow-right-line"></i></Link>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="ae-trust-badge">
          <i className="ri-shield-check-line"></i>
          YOUR TRUSTED MARKETPLACE IN ETHIOPIA
        </div>
      </div>
    </div>
  );
}

export default About;