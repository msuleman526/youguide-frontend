import { Button, Flex, Form, Input, Typography } from 'antd'
import React from 'react'
import AuthLayout from '../layouts/AuthLayout'
import OtherRegisterOption from '../components/OtherRegisterOption'
import { Link } from 'react-router-dom'

const Register = () => {



  return (
    <AuthLayout title={'Signup'} customCenterClassName="auth-card-height">
      <Form layout="vertical">
        <Form.Item label="Full Name" name={'fullName'}>
          <Input placeholder="Your name" />
        </Form.Item>
        <Form.Item label="Email" name={'email'}>
          <Input placeholder="Your email" />
        </Form.Item>
        <Form.Item label="Password" name={'password'}>
          <Input placeholder="Your password" />
        </Form.Item>
        <Flex justify="end" className="mb-2">
          <Link to={'/forget-password'}>Forget Password</Link>
        </Flex>
        <Form.Item>
          <Link to={'/otp'}><Button type="primary" block>Sign Up</Button></Link>
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
  )
}

export default Register
