import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import OtherRegisterOption from '../components/OtherRegisterOption';
import ApiService from '../APIServices/ApiService';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      ApiService.loginUser(values)
        .then(response => {
           setLoading(false)
           message.success("Welcome " + response.user.firstName + " " + response.user.lastName);
           localStorage.setItem("token", response.token);
           localStorage.setItem("user", JSON.stringify(response.user));
           navigate('/roles');
        })
        .catch(error => {
            setLoading(false)
            message.error(error?.response?.data?.message || "Login Failed.")
        });
    } catch (error) {
      setLoading(false)
      console.log("Error", error)
    }
  };

  return (
    <AuthLayout title="Sign in" customCenterClassName="auth-card-height">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
          ]}
        >
          <Input placeholder="Your email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Your password" />
        </Form.Item>
        <div className="flex justify-end mb-2">
          <Link to="/forget-password">Forget Password</Link>
        </div>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
        <div className="flex justify-center gap-1">
          <Typography.Text type="secondary">Do not have an account?</Typography.Text>
          <Link to="/register">Sign up</Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;
