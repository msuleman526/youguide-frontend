import { Flex, Layout, Menu, Typography } from 'antd';
import { VscLayout } from 'react-icons/vsc';
import { FaCalendarAlt, FaChartBar, FaCog, FaFileAlt } from 'react-icons/fa';
import { GrTransaction } from 'react-icons/gr';
import { IoMdSettings } from 'react-icons/io';
import { TbLogout2 } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const path = location.pathname.split('/');
    setSelectedMenu(path[1] || 'dashboard');
    if (path[1].includes('reports')) {
      setOpenKeys(['reports']);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  let iconStyle = {
    position: 'relative',
    top: collapsed ? '3.5px' : 0,
    left: collapsed ? '-3px' : 0,
  };

  let iconProps = {
    style: iconStyle,
    size: 18,
  };

  const handleMenuChange = ({ key, keyPath }) => {
    navigate('/' + key);
    setSelectedMenu(key);
  };

  return (
    <div>
      <Layout.Sider
        width={249}
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
            {collapsed ? 'L' : 'LOGO'}
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
            defaultSelectedKeys={[selectedMenu]}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            items={[
              {
                key: 'dashboard',
                icon: <VscLayout {...iconProps} />,
                label: 'Overview',
              },
              {
                key: 'reports',
                icon: <FaFileAlt {...iconProps} />,
                label: 'Reports',
                children: [
                  {
                    key: 'reports-by-month',
                    icon: <FaCalendarAlt {...iconProps} />,
                    label: 'By Month',
                  },
                  {
                    key: 'reports-by-month-compare',
                    icon: <FaChartBar {...iconProps} />,
                    label: 'By Month (Compare)',
                  },
                  {
                    key: 'reports-by-category',
                    icon: <FaChartBar {...iconProps} />,
                    label: 'By Category',
                  },
                  {
                    key: 'reports-by-category-group',
                    icon: <FaChartBar {...iconProps} />,
                    label: 'By Category Group',
                  },
                  {
                    key: 'reports-by-year',
                    icon: <FaCalendarAlt {...iconProps} />,
                    label: 'By Year',
                  },
                ],
              },
              {
                key: 'transaction',
                icon: <GrTransaction {...iconProps} />,
                label: 'Transactions',
              },
              {
                key: 'settings',
                icon: <FaCog {...iconProps} />,
                label: 'Settings',
              },
              {
                key: 'upload',
                icon: <FaCog {...iconProps} />,
                label: 'Upload',
              },
              // {
              //   key: 'members',
              //   icon: <TbUsers {...iconProps} />,
              //   label: 'Members',
              // },
            ]}
          />
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={[
              {
                key: 'logout',
                icon: <TbLogout2 {...iconProps} />,
                label: <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Logout
                  </Link>,
                danger: true,
              },
            ]}
          />
        </Flex>
      </Layout.Sider>
    </div>
  )
}

export default Sidebar
