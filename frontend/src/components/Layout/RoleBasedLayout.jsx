
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const RoleBasedLayout = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        console.log('User role detected:', user.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setUserRole(null);
      }
    } else {
      console.log('No user data found in localStorage');
      setUserRole(null);
    }
    setLoading(false);
  }, [location.pathname]);

  // Check if current path is admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  console.log('Current route:', location.pathname);
  console.log('Is admin route?', isAdminRoute);
  console.log('User role:', userRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin navbar for admin users on admin routes
  if (userRole === 'admin' && isAdminRoute) {
    console.log('Showing Admin Navbar');
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Show regular navbar for everyone else
  console.log('Showing Regular Navbar');
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default RoleBasedLayout;
