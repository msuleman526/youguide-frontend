import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Image,
  Input,
  Layout,
  Typography,
} from 'antd'
import profile from '../../assets/profile.png'
import { IoMdContact } from 'react-icons/io'
import { TbLogout2 } from 'react-icons/tb'
import { GoChevronDown } from 'react-icons/go'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { CiLight, CiDark } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react'

const LayoutHeader = ({ isMobile, collapsed, setCollapsed, theme, toggleTheme, showDrawer}) => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (accessToken && user) {
      setUser(JSON.parse(user));
    }
  }, [])

  const callLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }

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
      key: 'logout',
      icon: <TbLogout2 size={18} />,
      danger: true,
    },
  ]
  
  let iconColor = theme === 'dark' && '#D2D4D8'

  return (
    <Layout.Header>
      <Flex justify="space-between" align="center" gap={'small'}>
        {!isMobile ? <Button
          type="text"
          icon={
            collapsed ? (
              <FaChevronCircleLeft color={iconColor} />
            ) : (
              <FaChevronCircleRight color={iconColor} />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 40,
            marginTop: '10px',
            height: 40,
            marginLeft: '-55px'
          }}
        /> : <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={showDrawer}
            style={{
              fontSize: '16px',
              marginTop: '10px',
              width: 40,
              height: 40,
              marginLeft: '-40px'
            }}
        />}
        <Flex gap={'small'} align="center" style={{marginTop: '15px', marginRight: '-20px'}}>
          {/* <Input
            className={
              theme === 'light'
                ? 'header-search-input-light'
                : 'header-search-input-dark'
            }
            style={{maxWidth: '230px'}}
            prefix={<CiSearch color="#4A4A4C" size={21} />}
            size="large"
            placeholder="Search"
          /> */}
          <Dropdown menu={{ items }}>
            <Flex gap={'large'} align="center" style={{ cursor: 'pointer' }}>
              <Flex gap={'small'} align="center" flex={1}>
                <Avatar
                  src={<Image src={profile} alt="profile" preview={false} />}
                  shape="square"
                />
                <Typography.Text strong>{user?.firstName + " " + user?.lastName}</Typography.Text>
              </Flex>
              <GoChevronDown
                color={theme === 'light' ? '#4A4A4C' : '#E3E8F3'}
                size={18}
              />
            </Flex>
          </Dropdown>
          {/* <Button
            style={{
              backgroundColor: theme === 'dark' && '#05152b',
              borderColor: theme === 'dark' && '#143D69',
              borderRadius: '8px',
              height: '30px',
            }}
            onClick={toggleTheme}
            size="small"
          >
            {theme === 'dark' ? (
              <CiLight color="#fff" size={18} />
            ) : (
              <CiDark size={18} />
            )}
          </Button> */}
        </Flex>
      </Flex>
    </Layout.Header>
  )
}

export default LayoutHeader
