import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import OtherRegisterOption from '../components/OtherRegisterOption';
import ApiService from '../APIServices/ApiService';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    
    // Clear any existing authentication data before attempting login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('affiliateToken');
    localStorage.removeItem('affiliateData');
    localStorage.removeItem('affiliateUser');
    
    try {
      // First, try admin login
      setLoginType('Checking admin credentials...');
      const adminResponse = await ApiService.loginUser(values);
      const role = adminResponse.user.role.name;
      
      if (role.includes('Admin')) {
        // Admin login successful
        message.success("Welcome " + adminResponse.user.firstName + " " + adminResponse.user.lastName);
        localStorage.setItem("user", JSON.stringify(adminResponse.user));
        localStorage.setItem("token", adminResponse.token);
        navigate('/roles');
        setLoading(false);
        return;
      } else {
        // User exists but is not admin, try affiliate login
        throw new Error('Not an admin user');
      }
    } catch (adminError) {
      // Admin login failed, try affiliate login
      try {
        setLoginType('Checking affiliate credentials...');
        const affiliateResponse = await ApiService.loginAffiliate(values);
        
        // Store affiliate token and data
        localStorage.setItem('affiliateToken', affiliateResponse.token);
        localStorage.setItem('affiliateData', JSON.stringify(affiliateResponse.affiliate));
        localStorage.setItem('affiliateUser', JSON.stringify(affiliateResponse.user));
        
        message.success('Welcome ' + affiliateResponse.user.firstName + ' ' + affiliateResponse.user.lastName);
        navigate(`/affiliate-dashboard/${affiliateResponse.affiliate.id}`);
        setLoading(false);
        return;
      } catch (affiliateError) {
        // Both login attempts failed
        setLoading(false);
        setLoginType('');
        const errorMessage = affiliateError?.response?.data?.message || adminError?.response?.data?.message || "Invalid credentials. Please check your email and password.";
        message.error(errorMessage);
      }
    }
  };

  return (
    <AuthLayout title="Sign in to YouGuide" customCenterClassName="auth-card-height">
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
            {loading && loginType ? loginType : 'Login'}
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
