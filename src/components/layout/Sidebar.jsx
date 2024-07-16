import { Flex, Layout, Menu, Typography } from 'antd'
import { VscLayout } from 'react-icons/vsc'
import { FaCalendarAlt, FaChartBar, FaCog, FaDollarSign, FaFileAlt } from 'react-icons/fa'
import { GrTransaction } from 'react-icons/gr'
import { IoMdSettings } from 'react-icons/io'
import { TbLogout2, TbUsers } from 'react-icons/tb'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGauge } from 'react-icons/fa6'

const Sidebar = ({ collapsed, theme }) => {
  const navigate = useNavigate()
  const [selectMenu, setSelectedMenu] = useState('dashboard')

  useEffect(() => {
    loadMenuFromLocalStorage()
  }, [])

  const loadMenuFromLocalStorage = () => {
    const menuStorage = localStorage.getItem('menu')
    if (!menuStorage || menuStorage === undefined) {
      localStorage.setItem('menu', 'dashboard')
    } else {
      setSelectedMenu(menuStorage)
    }
  }

  let iconStyle = {
    position: 'relative',
    top: collapsed ? '3.5px' : 0,
    left: collapsed ? '-3px' : 0,
  }
  let iconProps = {
    style: iconStyle,
    size: 18,
  }

  const handleMenuChange = ({ key }) => {
    navigate('/' + key)
    setSelectedMenu(key)
    localStorage.setItem('menu', key)
  }
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
            selectedKeys={[selectMenu]}
            defaultSelectedKeys={[selectMenu]}
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
                key: 'setting',
                icon: <IoMdSettings {...iconProps} />,
                label: 'Setting',
              },
              {
                key: 'logout',
                icon: <TbLogout2 {...iconProps} />,
                label: 'Logout',
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
