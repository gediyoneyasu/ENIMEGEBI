import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Auth from './Components/Auth/Auth';
import AdminLogin from './Components/Admin/AdminLogin';

// Lazy load components
const Home = lazy(() => import('./Components/Home/Home'));
const Products = lazy(() => import('./Components/Products/Products'));
const Categories = lazy(() => import('./Components/Categories/Categories'));
const Cart = lazy(() => import('./Components/Cart/Cart'));
const Checkout = lazy(() => import('./Components/Checkout/Checkout'));
const Orders = lazy(() => import('./Components/Orders/Orders'));
const Profile = lazy(() => import('./Components/Profile/Profile'));
const About = lazy(() => import('./Components/About/About'));
const Contact = lazy(() => import('./Components/Contact/Contact'));
const Admin = lazy(() => import('./Components/Admin/Admin'));

function PageLoading() {
  return (
    <div className="page-loading">
      <div className="loader"></div>
      <p>Loading Enimegebi...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
