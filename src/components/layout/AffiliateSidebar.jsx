import { Flex, Image, Layout, Menu, Typography, Drawer } from 'antd';
import { FaChartBar, FaHotel } from 'react-icons/fa';
import { TbLogout2 } from 'react-icons/tb';
import { ApiOutlined } from '@ant-design/icons';
import { useEffect, useState, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import smallLogo from '../../assets/small_logo.png';
import largeLogo from '../../assets/large_logo.png';

const AffiliateSidebar = ({ collapsed, drawerVisible, setDrawerVisible, affiliate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('affiliate-dashboard');
  const [openKeys, setOpenKeys] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 550);

  let iconStyle = {
    position: 'relative',
    top: collapsed ? '3.5px' : 0,
    left: collapsed ? '-3px' : 0,
  };
  
  let iconProps = {
    style: iconStyle,
    size: 18,
  };

  useEffect(() => {
    const path = location.pathname.split('/');
    if (path.includes('affiliate-dashboard')) {
      setSelectedMenu('affiliate-dashboard');
    } else if (path.includes('affiliate-hotels')) {
      setSelectedMenu('my-hotels');
    } else if (path.includes('affiliate-api-access')) {
      setSelectedMenu('api-access-dashboard');
    }
  }, [location.pathname]);

  useLayoutEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 550);
    };

    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleMenuChange = ({ key }) => {
    if (key === 'affiliate-dashboard') {
      navigate(`/affiliate-dashboard/${affiliate?.id}`);
    } else if (key === 'my-hotels') {
      navigate(`/affiliate-hotels/${affiliate?.id}`);
    } else if (key === 'api-access-dashboard') {
      navigate(`/affiliate-api-access/${affiliate?.id}`);
    }
    setSelectedMenu(key);
    if (isMobile) {
      onClose();
    }
  };

  const logoutClick = () => {
    localStorage.removeItem('affiliateToken');
    localStorage.removeItem('affiliateData');
    localStorage.removeItem('affiliateUser');
    navigate('/login'); // Use unified login
  };

  const menuItems = [
    {
      key: 'affiliate-dashboard',
      icon: <FaChartBar {...iconProps} />,
      label: 'Dashboard',
    },
    {
      key: 'my-hotels',
      icon: <FaHotel {...iconProps} />,
      label: 'My Clients',
    },
    {
      key: 'api-access-dashboard',
      icon: <ApiOutlined style={iconStyle} />,
      label: 'API Access Dashboard',
    },
  ];

  const logoutItem = {
    key: 'logout',
    icon: <TbLogout2 {...iconProps} />,
    label: (
      <Link onClick={logoutClick} style={{ color: 'inherit', textDecoration: 'none' }}>
        Logout
      </Link>
    ),
    danger: true,
  };

  return (
    <div>
      {isMobile ? (
        <>
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={onClose}
            open={drawerVisible}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              onClick={handleMenuChange}
              mode="inline"
              className="custom_menu_sidebar"
              selectedKeys={[selectedMenu]}
              defaultSelectedKeys={['affiliate-dashboard']}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              items={[...menuItems, logoutItem]}
            />
          </Drawer>
        </>
      ) : (
        <Layout.Sider
          width={220}
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ minHeight: '100vh' }}
        >
          <Flex
            style={{ padding: '20px 20px 5px 20px' }}
            justify={collapsed ? 'center' : 'start'}
          >
            <Typography.Title level={3}>
              {collapsed ? (
                <Image src={smallLogo} preview={false} style={{ marginTop: '-5px', height: '45px'}} />
              ) : (
                <Image src={largeLogo} style={{ marginTop: '-5px', height: '45px'}} preview={false} />
              )}
            </Typography.Title>
          </Flex>
          
          {/* Affiliate Info */}
          {!collapsed && affiliate && (
            <div style={{ 
              padding: '10px 20px', 
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '10px' 
            }}>
              <Typography.Text strong style={{ display: 'block', fontSize: '14px' }}>
                {affiliate.affiliateName}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Clicks: {affiliate.pendingClicks}
              </Typography.Text>
            </div>
          )}
          
          <Flex
            vertical
            justify="space-between"
            style={{ height: 'calc(100vh - 90px)' }}
          >
            <Menu
              onClick={handleMenuChange}
              mode="inline"
              className="custom_menu_sidebar"
              selectedKeys={[selectedMenu]}
              defaultSelectedKeys={['affiliate-dashboard']}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              items={menuItems}
            />
            <Menu
              mode="inline"
              defaultSelectedKeys={['affiliate-dashboard']}
              items={[logoutItem]}
            />
          </Flex>
        </Layout.Sider>
      )}
    </div>
  );
};

export default AffiliateSidebar;
