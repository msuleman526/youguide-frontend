import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Check if affiliate is logged in
    const affiliateToken = localStorage.getItem('affiliateToken');
    const affiliateData = localStorage.getItem('affiliateData');

    if (affiliateToken && affiliateData) {
      try {
        const affiliate = JSON.parse(affiliateData);
        navigate(`/affiliate-dashboard/${affiliate.id}`);
        return;
      } catch (error) {
        console.error('Error parsing affiliate data:', error);
      }
    }

    // Check if admin is logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
      return;
    }

    // Not logged in, go to login
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={handleGoBack}>
            Go to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
