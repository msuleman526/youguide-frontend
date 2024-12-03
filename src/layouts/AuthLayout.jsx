import React, { useEffect } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Flex,
  Image,
  Layout,
  Row,
  Tooltip,
  Typography,
} from "antd";
import authImg from "../assets/login-background.svg";
import { authDarkTheme, authLightTheme } from "../theme/authTheme";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { CiDark, CiLight } from "react-icons/ci";
import { themeState } from "../atom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Card from "../components/Card";
import logo from "../assets/large_logo.png";

const AuthLayout = ({
  children,
  title,
  backToLogin = false,
  customCenterClassName = "",
  marginTop = "20px",
}) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useRecoilState(themeState);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (accessToken && user) {
      navigate('/roles');
    }
  }, [navigate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#29b8e3",
        },
        components: theme === "dark" ? authDarkTheme : authLightTheme,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Content>
          <Row style={{ height: "100vh" }}>
            <Col xs={24} md={12}>
              <Card className="h-100 card-border-radius" style={{height: '100%'}} height={"100%"}>
                {/* <Flex justify="end">
                  <Button
                    style={{
                      backgroundColor: theme === "dark" && "#05152b",
                      borderColor: theme === "dark" && "#143D69",
                      borderRadius: "8px",
                      height: "30px",
                    }}
                    onClick={toggleTheme}
                    size="small"
                  >
                    {theme === "dark" ? (
                      <Tooltip title="Light Mode">
                        <CiLight color="#fff" size={18} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Dark Mode">
                        <CiDark size={18} />
                      </Tooltip>
                    )}
                  </Button>
                </Flex> */}
                {backToLogin && (
                  <Link to={"/login"}>
                    <Flex gap={"small"} align="center">
                      <IoMdArrowRoundBack
                        size={19}
                        color={theme === "dark" ? "#fff" : "#353535"}
                      />
                      <Typography.Text>Back to Login</Typography.Text>
                    </Flex>
                  </Link>
                )}
                <Flex
                  vertical
                  style={{height: '100%'}}
                  className={`card_login w-100 ${customCenterClassName}`}
                  justify="center"
                >
                  <Flex justify="center" style={{ marginTop: marginTop }}>
                    <Image
                      src={logo}
                      style={{ width: "150px" }}
                      preview={false}
                    />
                  </Flex>
                  <Flex justify="center" style={{ marginTop: marginTop }}>
                    <Typography.Title
                      level={2}
                      style={{ color: theme === "light" && "#494949" }}
                    >
                      {title}
                    </Typography.Title>
                  </Flex>
                  {children}
                </Flex>
              </Card>
            </Col>
            <Col xs={0} sm={0} md={12} className="side-login">
              <Image
                preview={false}
                src={authImg}
                style={{ width: "100%", height: "100vh", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

export default AuthLayout;
