import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout, theme, Typography, Row, Col, Image, Spin, Button } from 'antd';
import AffiliateSidebar from '../components/layout/AffiliateSidebar';
import AffiliateLayoutHeader from '../components/layout/AffiliateLayoutHeader';
import { Outlet, useNavigate } from 'react-router-dom';
import { themeState } from '../atom';
import { useRecoilState } from 'recoil';
import {
  dashboardDarkTheme,
  dashboardLightTheme,
} from '../theme/dashboardTheme';
import { TourProvider, useTourContext } from '../context/TourContext';
import dayjs from 'dayjs';
import ApiService from '../APIServices/ApiService';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Subscription Expired Component for Affiliate Panel
const AffiliateSubscriptionExpired = ({ primaryColor }) => {
  const handleBackToLogin = () => {
    localStorage.removeItem('affiliateToken');
    localStorage.removeItem('affiliateData');
    localStorage.removeItem('affiliateUser');
    window.location.hash = '#/login';
    window.location.reload();
  };

  return (
    <Layout
      style={{
        background: `linear-gradient(135deg, ${primaryColor || '#29b8e3'}, ${primaryColor || '#29b8e3'})`,
        minHeight: '100vh',
        padding: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Content
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxHeight: '400px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        <Row justify="center" align="middle">
          <Col
            xs={24}
            sm={12}
            style={{
              padding: '20px',
              textAlign: 'left',
            }}
          >
            <Title
              level={2}
              style={{
                color: '#ff5e78',
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              Your Subscription of Admin Panel has Ended
            </Title>
            <Paragraph
              style={{
                color: '#666',
                fontSize: '16px',
                marginBottom: '24px',
              }}
            >
              Your admin panel subscription with YouGuide has expired. Please contact the administrator to renew your subscription and regain access.
            </Paragraph>
            <Button type="primary" size="large" danger onClick={handleBackToLogin}>
              Back to Login
            </Button>
          </Col>
          <Col
            xs={24}
            sm={12}
            style={{
              textAlign: 'center',
            }}
          >
            <Image
              src={require('../assets/expired.png')}
              alt="Subscription Expired"
              preview={false}
              style={{
                width: '100%',
                maxWidth: '400px',
              }}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

const AffiliateLayoutContent = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useRecoilState(themeState);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [affiliate, setAffiliate] = useState(null);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const navigate = useNavigate();
  const { startTour } = useTourContext();

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    // Authentication is now handled by ProtectedRoute component
    // Load the affiliate data from localStorage and check subscription via API
    const checkSubscription = async () => {
      setCheckingSubscription(true);
      const affiliateData = localStorage.getItem('affiliateData');

      if (affiliateData) {
        try {
          const parsedAffiliate = JSON.parse(affiliateData);
          setAffiliate(parsedAffiliate);

          // Call API to check if subscription has expired
          const affiliateId = parsedAffiliate._id || parsedAffiliate.id;
          if (affiliateId) {
            try {
              const expiryResponse = await ApiService.checkAffiliateSubscriptionExpiry(affiliateId);
              if (expiryResponse.expired) {
                setSubscriptionExpired(true);
              } else {
                setSubscriptionExpired(false);
                // Update localStorage with latest subscription end date if available
                if (expiryResponse.subscriptionEndDate) {
                  parsedAffiliate.subscriptionEndDate = expiryResponse.subscriptionEndDate;
                  localStorage.setItem('affiliateData', JSON.stringify(parsedAffiliate));
                  setAffiliate(parsedAffiliate);
                }
              }
            } catch (apiError) {
              console.error('Error checking subscription expiry via API:', apiError);
              // Fallback to localStorage check if API fails
              if (parsedAffiliate.subscriptionEndDate) {
                const subscriptionEnd = dayjs(parsedAffiliate.subscriptionEndDate);
                const today = dayjs();
                if (subscriptionEnd.isBefore(today, 'day')) {
                  setSubscriptionExpired(true);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error parsing affiliate data:', error);
        }
      }
      setCheckingSubscription(false);
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    updateWidthElements();
    const handleResize = () => {
      updateWidthElements();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let updateWidthElements = () => {
    window.innerWidth < 1400 ? setCollapsed(true) : setCollapsed(false);
    setIsMobile(window.innerWidth < 550);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  // Show loading spinner while checking subscription
  if (checkingSubscription) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // If subscription has expired, show the expired component
  if (subscriptionExpired) {
    return <AffiliateSubscriptionExpired primaryColor={affiliate?.primaryColor} />;
  }

  return (
    <ConfigProvider
      theme={{
        components: theme === 'dark' ? dashboardDarkTheme : dashboardLightTheme,
        token: {
          colorPrimary: affiliate?.primaryColor || '#29b8e3',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <AffiliateSidebar
          collapsed={collapsed}
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
          affiliate={affiliate}
        />
        <Layout>
          <AffiliateLayoutHeader
            isMobile={isMobile}
            showDrawer={showDrawer}
            toggleTheme={toggleTheme}
            theme={theme}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            affiliate={affiliate}
            onStartTour={startTour}
          />
          <Content className="layout-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const AffiliateLayout = ({ children }) => {
  return (
    <TourProvider>
      <AffiliateLayoutContent>{children}</AffiliateLayoutContent>
    </TourProvider>
  );
};

export default AffiliateLayout;
