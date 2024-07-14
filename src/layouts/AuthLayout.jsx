import React, { useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Image,
  Layout,
  Row,
  Tooltip,
  Typography,
} from 'antd'
import authImg from '../assets/auth.svg'
import { authDarkTheme, authLightTheme } from '../theme/authTheme'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { CiDark, CiLight } from 'react-icons/ci'
import { themeState } from '../atom'
import { IoMdArrowRoundBack } from 'react-icons/io'

const AuthLayout = ({
  children,
  title,
  backToLogin = false,
  customCenterClassName = '',
  marginTop = '20px',
}) => {
  const [theme, setTheme] = useRecoilState(themeState)

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C87EA',
        },
        components: theme === 'dark' ? authDarkTheme : authLightTheme,
      }}
    >
      <Layout>
        <Layout.Content className="min-h-100">
          <Row>
            <Col xs={0} sm={0} md={12}>
              <Flex justify="center" align="center" className="min-h-100">
                <Image preview={false} src={authImg} />
              </Flex>
            </Col>
            <Col xs={24} md={12}>
              <Card className="h-100 card-border-radius">
                <Flex justify="end">
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
                      <Tooltip title="Light Mode">
                        <CiLight color="#fff" size={18} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Dark Mode">
                        <CiDark size={18} />
                      </Tooltip>
                    )}
                  </Button>
                </Flex>
                {backToLogin && (
                  <Link to={'/login'}>
                    <Flex gap={'small'} align="center">
                      <IoMdArrowRoundBack
                        size={19}
                        color={theme === 'dark' ? '#fff' : '#353535'}
                      />
                      <Typography.Text>Back to Login</Typography.Text>
                    </Flex>
                  </Link>
                )}
                <Flex
                  vertical
                  className={`w-100 ${customCenterClassName}`}
                  justify="center"
                >
                  <Flex justify="center" style={{ marginTop: marginTop }}>
                    <Typography.Title
                      level={1}
                      style={{ color: theme === 'light' && '#494949' }}
                    >
                      {title}
                    </Typography.Title>
                  </Flex>
                  {children}
                </Flex>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

export default AuthLayout
