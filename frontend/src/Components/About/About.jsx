import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './About.css';

function About() {
  const { language } = useLanguage();  // Use context instead of local state

  const translations = {
    en: {
      title: 'About Enimegebi',
      subtitle: 'Connecting Farmers to Your Table',
      ourStory: 'Our Story',
      storyTitle: 'Fresh from Farm to Your Doorstep',
      storyText1: 'Enimegebi (Let\'s Eat It) was founded with a simple mission: to connect local farmers directly with consumers, eliminating middlemen and ensuring fair prices for everyone.',
      storyText2: 'What started as a small initiative in Hawassa has grown into a vibrant marketplace serving thousands of customers across Ethiopia. We believe in supporting local agriculture and promoting healthy, organic food choices.',
      storyText3: 'Our platform empowers farmers to reach wider markets while giving consumers access to fresh, affordable, and authentic Ethiopian products.',
      mission: 'Our Mission',
      missionText: 'To create a sustainable food ecosystem that benefits farmers, consumers, and the environment by making fresh, local produce accessible to everyone.',
      vision: 'Our Vision',
      visionText: 'A Ethiopia where every household has access to fresh, affordable, and nutritious local food while supporting sustainable agriculture.',
      values: 'Our Values',
      value1: 'Quality First',
      value1Desc: 'We ensure only the freshest, highest quality products reach our customers.',
      value2: 'Fair Trade',
      value2Desc: 'Farmers receive fair prices for their hard work and dedication.',
      value3: 'Sustainability',
      value3Desc: 'We promote eco-friendly farming practices and reduce food waste.',
      value4: 'Community',
      value4Desc: 'Building strong connections between farmers and local communities.',
      stats: 'Our Impact',
      farmers: 'Farmers',
      farmersCount: '500+',
      customers: 'Happy Customers',
      customersCount: '10,000+',
      products: 'Products Sold',
      productsCount: '50,000+',
      cities: 'Cities Served',
      citiesCount: '15+',
      team: 'Meet Our Team',
      teamTitle: 'The People Behind Enimegebi',
      teamDesc: 'Passionate individuals working to revolutionize Ethiopia\'s food supply chain.',
      joinUs: 'Join Our Mission',
      joinTitle: 'Become Part of the Enimegebi Family',
      joinText: 'Whether you\'re a farmer, supplier, or food lover, there\'s a place for you in our community.',
      partnerBtn: 'Become a Partner',
      contactBtn: 'Contact Us',
      ctaTitle: 'Ready to Experience Fresh Local Food?',
      ctaSubtitle: 'Join thousands of satisfied customers who trust Enimegebi for their daily food needs.',
      shopNow: 'Shop Now'
    },
    am: {
      title: 'ስለ እንመገቢ',
      subtitle: 'አርሶ አደሮችን ወደ ጠረጴዛዎ በማገናኘት ላይ',
      ourStory: 'ታሪካችን',
      storyTitle: 'ትኩስ ከእርሻ ወደ በርዎ',
      storyText1: 'እንመገቢ የተመሰረተው የአገር ውስጥ አርሶ አደሮችን በቀጥታ ከሸማቾች ጋር በማገናኘት ደላላዎችን በማስወገድ ለሁሉም ፍትሃዊ ዋጋ ለማረጋገጥ ነው።',
      storyText2: 'በሀዋሳ እንደ ትንሽ ተነሳሽነት የጀመረው በመላው ኢትዮጵያ በሺዎች ለሚቆጠሩ ደንበኞች እያገለገለ ወደሚገኝ ገበያ አድጓል።',
      storyText3: 'የእኛ መድረክ አርሶ አደሮችን ሰፊ ገበያ እንዲደርሱ እያገዘ ሸማቾች ትኩስ፣ ተመጣጣኝ እና ትክክለኛ የኢትዮጵያ ምርቶች እንዲያገኙ ያስችላል።',
      mission: 'ተልዕኮአችን',
      missionText: 'አርሶ አደሮችን፣ ሸማቾችን እና አካባቢን ተጠቃሚ የሚያደርግ ዘላቂ የምግብ ሥርዓት ለመፍጠር ትኩስ፣ የአገር ውስጥ ምርቶችን ለሁሉም ተደራሽ ለማድረግ።',
      vision: 'ራዕያችን',
      visionText: 'እያንዳንዱ ቤተሰብ ትኩስ፣ ተመጣጣኝ እና ገንቢ የሆነ የአገር ውስጥ ምግብ የሚያገኝበት ኢትዮጵያ ማየት።',
      values: 'እሴቶቻችን',
      value1: 'ጥራት ቀዳሚ',
      value1Desc: 'ከፍተኛ ጥራት ያላቸው ምርቶች ብቻ ደንበኞቻችን እንዲደርሱ እናረጋግጣለን።',
      value2: 'ፍትሃዊ ንግድ',
      value2Desc: 'አርሶ አደሮች ለትጋታቸው ፍትሃዊ ዋጋ ያገኛሉ።',
      value3: 'ዘላቂነት',
      value3Desc: 'ለአካባቢ ተስማሚ የሆኑ የእርሻ ልምዶችን እናዳብራለን እንዲሁም የምግብ ብክነትን እንቀንሳለን።',
      value4: 'ማህበረሰብ',
      value4Desc: 'በአርሶ አደሮች እና በአካባቢ ማህበረሰቦች መካከል ጠንካራ ትስስር መፍጠር።',
      stats: 'ተጽኖአችን',
      farmers: 'አርሶ አደሮች',
      farmersCount: '500+',
      customers: 'ደስተኛ ደንበኞች',
      customersCount: '10,000+',
      products: 'የተሸጡ ምርቶች',
      productsCount: '50,000+',
      cities: 'ከተሞች',
      citiesCount: '15+',
      team: 'ቡድናችን',
      teamTitle: 'ከእንመገቢ በስተጀርባ ያሉ ሰዎች',
      teamDesc: 'የኢትዮጵያን የምግብ አቅርቦት ሰንሰለት ለማሻሻል የሚሰሩ ተመራማሪ ግለሰቦች።',
      joinUs: 'ተልዕኮአችን ይቀላቀሉ',
      joinTitle: 'የእንመገቢ ቤተሰብ አካል ይሁኑ',
      joinText: 'አርሶ አደር፣ አቅራቢ ወይም ምግብ ወዳድ ቢሆኑ፣ በማህበረሰባችን ውስጥ ቦታ አለዎት።',
      partnerBtn: 'አጋር ይሁኑ',
      contactBtn: 'ያግኙን',
      ctaTitle: 'ትኩስ የአገር ውስጥ ምግብ ለመቅመስ ዝግጁ ነዎት?',
      ctaSubtitle: 'በየቀኑ የምግብ ፍላጎታቸው እንመገቢን ከሚተማመኑ በሺዎች ከሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ።',
      shopNow: 'አሁን ይግዙ'
    }
  };

  const t = translations[language];

  const teamMembers = [
    { id: 1, name: 'Gedu', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/men/1.jpg', bio: 'Passionate about connecting farmers to markets' },
    { id: 2, name: 'Sarah Johnson', role: 'Operations Director', image: 'https://randomuser.me/api/portraits/women/2.jpg', bio: 'Supply chain expert with 10+ years experience' },
    { id: 3, name: 'Michael Chen', role: 'Tech Lead', image: 'https://randomuser.me/api/portraits/men/3.jpg', bio: 'Building the future of food tech' },
    { id: 4, name: 'Emma Wilson', role: 'Community Manager', image: 'https://randomuser.me/api/portraits/women/4.jpg', bio: 'Connecting farmers and customers daily' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500" alt="Farmers" />
            </div>
            <div className="story-text">
              <small>{t.ourStory}</small>
              <h2>{t.storyTitle}</h2>
              <p>{t.storyText1}</p>
              <p>{t.storyText2}</p>
              <p>{t.storyText3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <i className="ri-flag-line"></i>
              <h3>{t.mission}</h3>
              <p>{t.missionText}</p>
            </div>
            <div className="vision-card">
              <i className="ri-eye-line"></i>
              <h3>{t.vision}</h3>
              <p>{t.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">{t.values}</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="ri-star-line"></i>
              <h3>{t.value1}</h3>
              <p>{t.value1Desc}</p>
            </div>
            <div className="value-card">
              <i className="ri-hand-heart-line"></i>
              <h3>{t.value2}</h3>
              <p>{t.value2Desc}</p>
            </div>
            <div className="value-card">
              <i className="ri-leaf-line"></i>
              <h3>{t.value3}</h3>
              <p>{t.value3Desc}</p>
            </div>
            <div className="value-card">
              <i className="ri-group-line"></i>
              <h3>{t.value4}</h3>
              <p>{t.value4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">{t.stats}</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{t.farmersCount}</div>
              <div className="stat-label">{t.farmers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{t.customersCount}</div>
              <div className="stat-label">{t.customers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{t.productsCount}</div>
              <div className="stat-label">{t.products}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{t.citiesCount}</div>
              <div className="stat-label">{t.cities}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">{t.team}</h2>
          <p className="team-subtitle">{t.teamDesc}</p>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <span>{member.bio}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-section">
        <div className="container">
          <div className="join-content">
            <h2>{t.joinTitle}</h2>
            <p>{t.joinText}</p>
            <div className="join-buttons">
              <Link to="/contact" className="join-btn">{t.partnerBtn}</Link>
              <Link to="/contact" className="contact-btn">{t.contactBtn}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSubtitle}</p>
            <Link to="/products" className="cta-btn">{t.shopNow} <i className="ri-arrow-right-line"></i></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;