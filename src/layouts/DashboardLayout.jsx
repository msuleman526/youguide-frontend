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
const { Content } = Layout

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [theme, setTheme] = useRecoilState(themeState)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!accessToken || !user) {
      navigate('/login');
    }
  }, [navigate]);

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
          />
          <Content className="layout-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
export default DashboardLayout
