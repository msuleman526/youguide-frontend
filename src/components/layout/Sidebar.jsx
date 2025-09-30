import { Flex, Image, Layout, Menu, Typography, Drawer, Button } from 'antd';
import { VscLayout } from 'react-icons/vsc';
import { FaBook, FaCalendarAlt, FaChartBar, FaCog, FaFileAlt, FaList } from 'react-icons/fa';
import { GrTransaction } from 'react-icons/gr';
import { TbLogout2 } from 'react-icons/tb';
import { useEffect, useState, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import smallLogo from '../../assets/small_logo.png';
import largeLogo from '../../assets/large_logo.png';
import { BiUser } from 'react-icons/bi';

const Sidebar = ({ collapsed, drawerVisible, setDrawerVisible}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
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
    const menuKey = (path[1] === 'admin-dashboard' || path[1] === 'dashboard') ? 'admin-dashboard' : (path[1] || 'admin-dashboard');
    setSelectedMenu(menuKey);
    if (path[1].includes('reports')) {
      setOpenKeys(['reports']);
    } else {
      setOpenKeys([]);
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

  const handleMenuChange = ({ key, keyPath }) => {
    navigate('/' + key);
    setSelectedMenu(key);
    if (isMobile) {
      onClose();
    }
  };

  const logoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload()
  };

  const menuItems = [
    {
      key: 'admin-dashboard',
      icon: <FaChartBar {...iconProps} />,
      label: 'Admin Dashboard',
    },
    {
      key: 'roles',
      icon: <VscLayout {...iconProps} />,
      label: 'Manage Roles',
    },
    {
      key: 'users',
      icon: <BiUser {...iconProps} />,
      label: 'Manage Users',
    },
    {
      key: 'teams',
      icon: <BiUser {...iconProps} />,
      label: 'Manage Teams',
    },
    {
      key: 'categories',
      icon: <FaList {...iconProps} />,
      label: 'Manage Categories',
    },
    {
      key: 'books',
      icon: <FaBook {...iconProps} />,
      label: 'Manage Guides',
    },
    {
      key: 'transactions',
      icon: <FaCog {...iconProps} />,
      label: 'Transactions',
    },
    {
      key: 'vendors',
      icon: <FaCog {...iconProps} />,
      label: 'Vendors',
    },
    {
      key: 'affiliates',
      icon: <FaCog {...iconProps} />,
      label: 'Affiliates',
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
              defaultSelectedKeys={['admin-dashboard']}
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
                <Image src={largeLogo}  style={{ marginTop: '-5px', height: '45px'}} preview={false} />
              )}
            </Typography.Title>
          </Flex>
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
              defaultSelectedKeys={['admin-dashboard']}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              items={menuItems}
            />
            <Menu
              mode="inline"
              defaultSelectedKeys={['admin-dashboard']}
              items={[logoutItem]}
            />
          </Flex>
        </Layout.Sider>
      )}
    </div>
  );
};

export default Sidebar;
