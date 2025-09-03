import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect = () => {
  // Check admin authentication first
  const adminToken = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (adminToken && user) {
    try {
      const userObj = JSON.parse(user);
      const isAdmin = userObj.role?.name?.includes('Admin');
      if (isAdmin) {
        return <Navigate to="/admin-dashboard" replace />;
      }
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      // Clear corrupted admin data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  // Check affiliate authentication
  const affiliateToken = localStorage.getItem('affiliateToken');
  const affiliateData = localStorage.getItem('affiliateData');
  
  if (affiliateToken && affiliateData) {
    try {
      const affiliate = JSON.parse(affiliateData);
      if (affiliate.id) {
        return <Navigate to={`/affiliate-dashboard/${affiliate.id}`} replace />;
      }
    } catch (error) {
      console.error('Error parsing affiliate data:', error);
      // Clear corrupted affiliate data
      localStorage.removeItem('affiliateToken');
      localStorage.removeItem('affiliateData');
      localStorage.removeItem('affiliateUser');
    }
  }
  
  // No valid authentication found, redirect to login
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
