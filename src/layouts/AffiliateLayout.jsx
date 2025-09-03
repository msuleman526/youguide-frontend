import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout, theme } from 'antd';
import AffiliateSidebar from '../components/layout/AffiliateSidebar';
import AffiliateLayoutHeader from '../components/layout/AffiliateLayoutHeader';
import { Outlet, useNavigate } from 'react-router-dom';
import { themeState } from '../atom';
import { useRecoilState } from 'recoil';
import {
  dashboardDarkTheme,
  dashboardLightTheme,
} from '../theme/dashboardTheme';

const { Content } = Layout;

const AffiliateLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useRecoilState(themeState);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [affiliate, setAffiliate] = useState(null);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    // Authentication is now handled by ProtectedRoute component
    // Just load the affiliate data from localStorage
    const affiliateData = localStorage.getItem('affiliateData');
    
    if (affiliateData) {
      try {
        const parsedAffiliate = JSON.parse(affiliateData);
        setAffiliate(parsedAffiliate);
      } catch (error) {
        console.error('Error parsing affiliate data:', error);
      }
    }
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
          />
          <Content className="layout-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AffiliateLayout;
