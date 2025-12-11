import React, { useEffect, useState } from 'react'
import { ConfigProvider, Layout, theme } from 'antd'
import Sidebar from '../components/layout/Sidebar'
import LayoutHeader from '../components/layout/LayoutHeader'
import { Outlet, useNavigate } from 'react-router-dom'
import { themeState } from '../atom'
import { useRecoilState } from 'recoil'
import {
  dashboardDarkTheme,
  dashboardLightTheme,
} from '../theme/dashboardTheme'
import { TourProvider, useTourContext } from '../context/TourContext'
const { Content } = Layout

const DashboardLayoutContent = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [theme, setTheme] = useRecoilState(themeState)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const navigate = useNavigate();
  const { startTour } = useTourContext();

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme])

  // Authentication is now handled by ProtectedRoute component

  useEffect(() => {
    updateWidthElements()
    const handleResize = () => {
      updateWidthElements()
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let updateWidthElements = () => {
    window.innerWidth < 1400 ? setCollapsed(true) : setCollapsed(false);
    setIsMobile(window.innerWidth < 550)
  }

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  return (
    <ConfigProvider
      theme={{
        components: theme === 'dark' ? dashboardDarkTheme : dashboardLightTheme,
        token: {
          colorPrimary: '#29b8e3',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} drawerVisible={drawerVisible} setDrawerVisible={setDrawerVisible}/>
        <Layout>
          <LayoutHeader
            isMobile={isMobile}
            showDrawer={showDrawer}
            toggleTheme={toggleTheme}
            theme={theme}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onStartTour={startTour}
          />
          <Content className="layout-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

const DashboardLayout = ({ children }) => {
  return (
    <TourProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </TourProvider>
  );
};

export default DashboardLayout
