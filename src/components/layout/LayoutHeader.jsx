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
import { CiSearch } from 'react-icons/ci'
import { IoMdContact } from 'react-icons/io'
import { TbLogout2 } from 'react-icons/tb'
import { GoChevronDown } from 'react-icons/go'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { CiLight, CiDark } from 'react-icons/ci'

const LayoutHeader = ({ collapsed, setCollapsed, theme, toggleTheme }) => {
  const items = [
    {
      label: 'Profile',
      icon: <IoMdContact size={18} />,
      key: 'profile',
    },

    {
      label: 'Logout',
      key: 'logout',
      icon: <TbLogout2 size={18} />,
      danger: true,
    },
  ]
  let iconColor = theme === 'dark' && '#D2D4D8'
  return (
    <Layout.Header>
      <Flex justify="space-between" align="center" gap={'small'}>
        <Button
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
            width: 64,
            height: 64,
          }}
        />
        <Flex gap={'small'} align="center">
          <Input
            className={
              theme === 'light'
                ? 'header-search-input-light'
                : 'header-search-input-dark'
            }
            prefix={<CiSearch color="#4A4A4C" size={21} />}
            size="large"
            placeholder="Search"
          />
          <Dropdown menu={{ items }}>
            <Flex gap={'large'} align="center" style={{ cursor: 'pointer' }}>
              <Flex gap={'small'} align="center" flex={1}>
                <Avatar
                  src={<Image src={profile} alt="profile" preview={false} />}
                  shape="square"
                />
                <Typography.Text strong>Ismail Khan</Typography.Text>
              </Flex>
              <GoChevronDown
                color={theme === 'light' ? '#4A4A4C' : '#E3E8F3'}
                size={18}
              />
            </Flex>
          </Dropdown>
          <Button
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
          </Button>
        </Flex>
      </Flex>
    </Layout.Header>
  )
}

export default LayoutHeader
