const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@enimegebi.com' });
    
    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@enimegebi.com',
        password: 'admin123',
        role: 'admin',
        phone: '',
        address: '',
        city: ''
      });
      console.log('✅ Admin user created:', admin.email);
      console.log('📧 Email: admin@enimegebi.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('⚠️ Admin user already exists');
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
