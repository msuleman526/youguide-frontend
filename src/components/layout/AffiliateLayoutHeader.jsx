import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Image,
  Layout,
  Typography,
} from 'antd';
import profile from '../../assets/profile.png';
import { IoMdContact } from 'react-icons/io';
import { TbLogout2 } from 'react-icons/tb';
import { GoChevronDown } from 'react-icons/go';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { CiLight, CiDark } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { MenuOutlined, RocketOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const AffiliateLayoutHeader = ({ isMobile, collapsed, setCollapsed, theme, toggleTheme, showDrawer, affiliate, onStartTour }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const affiliateUser = localStorage.getItem('affiliateUser');
    if (affiliateUser) {
      setUser(JSON.parse(affiliateUser));
    }
  }, []);

  const callLogout = () => {
    localStorage.removeItem('affiliateToken');
    localStorage.removeItem('affiliateData');
    localStorage.removeItem('affiliateUser');
    window.location.href = '/';
  };

  const items = [
    {
      label: 'Profile',
      icon: <IoMdContact size={18} />,
      key: 'profile',
    },
    {
      label: (
        <Link onClick={callLogout} style={{ color: 'inherit', textDecoration: 'none' }}>
          Logout
        </Link>
      ),
      icon: <TbLogout2 size={18} />,
      key: 'logout',
    },
  ];

  return (
    <Layout.Header className="custom_header">
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" align="center">
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={showDrawer}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          ) : (
            <Button
              type="text"
              icon={
                collapsed ? (
                  <FaChevronCircleRight
                    size={20}
                    className="fw-500"
                    color="#66b3ff"
                  />
                ) : (
                  <FaChevronCircleLeft
                    size={20}
                    className="fw-500"
                    color="#66b3ff"
                  />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          )}
        
        </Flex>

        <Flex gap="small" align="center">
          {onStartTour && (
            <Button
              type="default"
              icon={<RocketOutlined />}
              onClick={onStartTour}
              style={{
                borderRadius: '8px',
                height: '40px',
              }}
            >
              Tour
            </Button>
          )}
          <Button
            type="text"
            icon={theme === 'light' ? <CiDark size={20} /> : <CiLight size={20} />}
            onClick={toggleTheme}
            style={{ fontSize: '16px', width: 40, height: 40 }}
          />

          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Button type="text">
              <Flex gap="small" align="center">
                <Avatar src={affiliate?.logo || profile} />
                <div>
                  <Typography.Text className="fw-500" style={{ display: 'block' }}>
                    {user?.firstName || 'Affiliate'} {user?.lastName || 'User'}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px', display: 'block' }}
                  >
                    Affiliate Portal
                  </Typography.Text>
                </div>
                <GoChevronDown size={12} />
              </Flex>
            </Button>
          </Dropdown>
        </Flex>
      </Flex>
    </Layout.Header>
  );
};

export default AffiliateLayoutHeader;
