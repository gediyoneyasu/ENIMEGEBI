const mongoose = require('mongoose');

const homeSettingSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Fresh from Farm' },
  heroTitleAm: { type: String, default: 'ከእርሻ የተገኘ' },
  heroSubtitle: { type: String, default: '100% Organic & Local Products' },
  heroSubtitleAm: { type: String, default: '100% ኦርጋኒክ እና የአገር ውስጥ ምርቶች' },
  featuresTitle: { type: String, default: 'Why Choose Enimegebi?' },
  featuresTitleAm: { type: String, default: 'ለምን እንመገቢን ይመርጣሉ?' },
  ctaTitle: { type: String, default: 'Fresh Products Delivered to Your Doorstep' },
  ctaTitleAm: { type: String, default: 'ትኩስ ምርቶች ወደ በርዎ ይደርሳሉ' },
  ctaSubtitle: { type: String, default: 'Join thousands of happy customers' },
  ctaSubtitleAm: { type: String, default: 'በሺዎች ከሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ' },
  phone: { type: String, default: '+251 96 411 3416' },
  email: { type: String, default: 'info@enimegebi.com' },
  address: { type: String, default: 'Addis Ababa, Ethiopia' },
  addressAm: { type: String, default: 'አዲስ አበባ፣ ኢትዮጵያ' },
  facebook: { type: String, default: 'https://facebook.com/enimegebi' },
  twitter: { type: String, default: 'https://twitter.com/enimegebi' },
  instagram: { type: String, default: 'https://instagram.com/enimegebi' },
  telegram: { type: String, default: 'https://t.me/enimegebi' }
});

module.exports = mongoose.model('HomeSetting', homeSettingSchema);
