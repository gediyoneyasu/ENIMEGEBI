const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/enimegebi')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@emarkato.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Password: admin123');
      process.exit();
    }
    
    // Create new admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'E-MARKATO Admin',
      email: 'admin@emarkato.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@emarkato.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

createAdmin();
