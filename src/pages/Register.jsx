import { Button, Checkbox, Col, Form, Input, Row, Typography, message } from 'antd';
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
      affiliate: values.affiliate,
      termsAccepted: values.termsAccepted,
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
      handleErrors("User Registration", err);
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name!' }]}
            >
              <Input placeholder="First name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name!' }]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password placeholder="Your password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="affiliate" valuePropName="checked">
          <Checkbox>Affiliate</Checkbox>
        </Form.Item>

        <Form.Item
          name="termsAccepted"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions!')),
            },
          ]}
        >
          <Checkbox>
            I agree with the <Link to={'/terms'}>terms of use</Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} type="primary" block htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Typography.Text type="secondary">
            Already have an account?
          </Typography.Text>
          <Link to={'/login'}> Login</Link>
        </div>

        <OtherRegisterOption />
      </Form>
    </AuthLayout>
  );
};

export default Register;
