import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, type = 'admin' }) => {
  if (type === 'admin') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Check if user is logged in as affiliate but trying to access admin routes
    const affiliateToken = localStorage.getItem('affiliateToken');
    const affiliateData = localStorage.getItem('affiliateData');

    if (!token || !user) {
      // If affiliate is logged in but trying to access admin route, show unauthorized
      if (affiliateToken && affiliateData) {
        return <Navigate to="/unauthorized" replace />;
      }
      return <Navigate to="/login" replace />;
    }

    try {
      const userObj = JSON.parse(user);
      const isAdmin = userObj.role?.name?.includes('Admin');
      if (!isAdmin) {
        // If affiliate is logged in but user is not admin, show unauthorized
        if (affiliateToken && affiliateData) {
          return <Navigate to="/unauthorized" replace />;
        }
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  if (type === 'affiliate') {
    const affiliateToken = localStorage.getItem('affiliateToken');
    const affiliateData = localStorage.getItem('affiliateData');

    if (!affiliateToken || !affiliateData) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
