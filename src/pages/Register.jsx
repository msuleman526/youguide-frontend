import { Button, Flex, Form, Input, Typography, message } from 'antd';
import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import OtherRegisterOption from '../components/OtherRegisterOption';
import { Link } from 'react-router-dom';
import { handleErrors } from '../Utils/Utils';
import { REGISTER_USER } from '../Utils/Apis';

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    
    const data = {
      isActive: true,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobileNo: values.mobileNo,
      password: values.password,
    };

    setLoading(true);
    try {
      const response = await REGISTER_USER(data);
      setLoading(false);
      message.success('Registration successful!');
      console.log(response);
      // Handle successful registration, e.g., redirect to OTP page
    } catch (err) {
      setLoading(false);
      handleErrors("User Registeration", err)
    }
  };

  return (
    <AuthLayout title={'Signup'} customCenterClassName="auth-card-height">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name!' }]}
        >
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name!' }]}
        >
          <Input placeholder="Last name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Your email" />
        </Form.Item>
        <Form.Item
          label="Mobile Number"
          name="mobileNo"
          rules={[
            { required: true, message: 'Please enter your mobile number!' },
            { pattern: /^[0-9]{10,}$/, message: 'Please enter a valid mobile number!' },
          ]}
        >
          <Input placeholder="Your mobile number" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password placeholder="Your password" />
        </Form.Item>
        <Flex justify="end" className="mb-2">
          <Link to={'/forget-password'}>Forget Password</Link>
        </Flex>
        <Form.Item>
          <Button loading={loading} type="primary" block htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
        <Flex gap={'small'} justify="center">
          <Typography.Text type="secondary">
            Already have an account?
          </Typography.Text>
          <Link to={'/login'}>Login</Link>
        </Flex>
        <OtherRegisterOption />
      </Form>
    </AuthLayout>
  );
};

export default Register;
