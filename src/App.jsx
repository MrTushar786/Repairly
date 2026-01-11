import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import About from './pages/About';
import Booking from './pages/Booking';
import Business from './pages/Business';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ClientLogin from './pages/Client/Login';
import ClientSignup from './pages/Client/Signup';
import ClientDashboard from './pages/Client/Dashboard';
import AuthListener from './components/AuthListener';
import { ShopProvider } from './context/ShopContext';
import './App.css';

function App() {
  return (
    <Router>
      <ShopProvider>
        <ScrollToTop />
        <AuthListener />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="booking" element={<Booking />} />
            <Route path="business" element={<Business />} />
            <Route path="login" element={<ClientLogin />} />
            <Route path="signup" element={<ClientSignup />} />
            <Route path="client/dashboard" element={<ClientDashboard />} />
          </Route>

          {/* Admin Routes - Standalone Layout */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </ShopProvider>
    </Router>
  );
}

export default App;
