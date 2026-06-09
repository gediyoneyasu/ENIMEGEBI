const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/enimegebi')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  imageUrl: String,
  status: { type: String, default: 'active' },
  stock: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest Apple smartphone with A17 Pro chip',
    price: 129999,
    category: 'ELECTRONICS',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    status: 'active',
    stock: 50
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with AI features',
    price: 119999,
    category: 'ELECTRONICS',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    status: 'active',
    stock: 45
  },
  {
    name: 'MacBook Pro M3',
    description: 'Powerful laptop for professionals',
    price: 249999,
    category: 'ELECTRONICS',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    status: 'active',
    stock: 30
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Noise cancelling wireless headphones',
    price: 34999,
    category: 'ELECTRONICS',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    status: 'active',
    stock: 100
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Smartwatch with health features',
    price: 45999,
    category: 'ELECTRONICS',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    status: 'active',
    stock: 75
  },
  {
    name: 'Men Classic Cotton T-Shirt',
    description: 'Comfortable everyday wear',
    price: 899,
    category: 'FASHION',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
    status: 'active',
    stock: 200
  },
  {
    name: 'Women Summer Floral Dress',
    description: 'Elegant summer dress',
    price: 2499,
    category: 'FASHION',
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg',
    status: 'active',
    stock: 150
  },
  {
    name: 'Nike Air Max Running Shoes',
    description: 'Comfortable sports shoes',
    price: 8999,
    category: 'FASHION',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    status: 'active',
    stock: 80
  },
  {
    name: 'Premium Coffee Maker',
    description: 'Brew perfect coffee at home',
    price: 5499,
    category: 'HOME & KITCHEN',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    status: 'active',
    stock: 60
  },
  {
    name: 'Digital Air Fryer 5.5L',
    description: 'Healthy cooking with less oil',
    price: 7999,
    category: 'HOME & KITCHEN',
    image: 'https://images.pexels.com/photos/5907619/pexels-photo-5907619.jpeg',
    status: 'active',
    stock: 45
  },
  {
    name: 'Organic Pure Honey 1kg',
    description: 'Natural Ethiopian honey',
    price: 450,
    category: 'GROCERIES',
    image: 'https://images.pexels.com/photos/6475169/pexels-photo-6475169.jpeg',
    status: 'active',
    stock: 500
  },
  {
    name: 'Ethiopian Yirgacheffe Coffee',
    description: 'Premium roasted coffee beans',
    price: 350,
    category: 'GROCERIES',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    status: 'active',
    stock: 300
  },
  {
    name: 'Complete JavaScript Book',
    description: 'Learn programming from scratch',
    price: 899,
    category: 'BOOKS',
    image: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg',
    status: 'active',
    stock: 120
  },
  {
    name: 'Fiction Novel Bundle',
    description: 'Set of 5 best selling novels',
    price: 1299,
    category: 'BOOKS',
    image: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg',
    status: 'active',
    stock: 85
  }
];

async function createProducts() {
  try {
    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${result.length} sample products!`);
    console.log('Products added:');
    result.forEach(p => console.log(`  - ${p.name} (${p.category}) - ETB ${p.price}`));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

createProducts();
