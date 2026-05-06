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
import { MdEmail } from 'react-icons/md';
import { AmazonOutlined, ApiOutlined, PhoneOutlined } from '@ant-design/icons';

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

  const managementKeys = ['roles', 'users', 'teams', 'all-requests', 'all-contacts', 'newsletters'];
  const websiteAppKeys = ['categories', 'books', 'language-guides', 'website-packages', 'coupons', 'discounts'];
  const affiliatesKeys = ['affiliates', 'link-approvals', 'api-access-approvals', 'admin-payouts', 'admin-earnings-report'];

  useEffect(() => {
    const path = location.pathname.split('/');
    const menuKey = (path[1] === 'admin-dashboard' || path[1] === 'dashboard') ? 'admin-dashboard' : (path[1] || 'admin-dashboard');

    // Handle nested routes
    if (path[1] === 'api-access' && path[2]) {
      setSelectedMenu(`api-access/${path[2]}`);
      setOpenKeys(['api-access']);
    } else if (managementKeys.includes(menuKey)) {
      setSelectedMenu(menuKey);
      setOpenKeys(['management']);
    } else if (websiteAppKeys.includes(menuKey)) {
      setSelectedMenu(menuKey);
      setOpenKeys(['website-app']);
    } else if (affiliatesKeys.includes(menuKey)) {
      setSelectedMenu(menuKey);
      setOpenKeys(['affiliates-group']);
    } else {
      setSelectedMenu(menuKey);
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
      key: 'management',
      icon: <BiUser {...iconProps} />,
      label: 'Management',
      children: [
        { key: 'roles', label: 'Roles' },
        { key: 'teams', label: 'Teams' },
        { key: 'users', label: 'Users' },
        { key: 'all-requests', label: 'Requests' },
        { key: 'all-contacts', label: 'Contacts' },
        { key: 'newsletters', label: 'Newsletters' },
      ],
    },
    {
      key: 'website-app',
      icon: <FaBook {...iconProps} />,
      label: 'Website & App',
      children: [
        { key: 'categories', label: 'Categories' },
        { key: 'books', label: 'Travel Guides' },
        { key: 'language-guides', label: 'Language Guides' },
        { key: 'website-packages', label: 'Website Packages' },
        { key: 'coupons', label: 'Coupons' },
        { key: 'discounts', label: 'Discounts' },
      ],
    },
    {
      key: 'transactions',
      icon: <GrTransaction {...iconProps} />,
      label: 'Transactions',
    },
    {
      key: 'amazon-purchases',
      icon: <AmazonOutlined style={iconStyle} />,
      label: 'Amazon Purchases',
    },
    {
      key: 'website-orders',
      icon: <FaFileAlt {...iconProps} />,
      label: 'Website Orders',
    },
    {
      key: 'api-access',
      icon: <ApiOutlined style={iconStyle} />,
      label: 'API Access',
      children: [
        {
          key: 'api-access/dashboard',
          label: 'Dashboard',
        },
        {
          key: 'api-access/list',
          label: 'API Access List',
        },
      ],
    },
    {
      key: 'vendors',
      icon: <FaCog {...iconProps} />,
      label: 'Vendors',
    },
    {
      key: 'affiliates-group',
      icon: <FaCog {...iconProps} />,
      label: 'Affiliates',
      children: [
        { key: 'affiliates', label: 'All Affiliates' },
        { key: 'link-approvals', label: 'Link Approvals' },
        { key: 'api-access-approvals', label: 'API Access Approvals' },
        { key: 'admin-payouts', label: 'Payouts' },
        { key: 'admin-earnings-report', label: 'Earnings Report' },
      ],
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
