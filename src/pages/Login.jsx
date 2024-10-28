import { Button, Flex, Form, Input, Typography } from 'antd'
import React from 'react'
import AuthLayout from '../layouts/AuthLayout'
import OtherRegisterOption from '../components/OtherRegisterOption'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <AuthLayout title={'Sign in'} customCenterClassName="auth-card-height">
      <Form layout="vertical">
        <Form.Item label="Name" name={'name'}>
          <Input placeholder="Your name" />
        </Form.Item>
        <Form.Item label="Password" name={'password'}>
          <Input placeholder="Your password" />
        </Form.Item>
        <Flex justify="end" className="mb-2">
          <Link to={'/forget-password'}>Forget Password</Link>
        </Flex>
        <Form.Item>
          <Link to={'/roles'}><Button type="primary" block>Login</Button></Link>
        </Form.Item>
        <Flex gap={'small'} justify="center">
          <Typography.Text type="secondary">
            Do not have an account?
          </Typography.Text>
          <Link to={'/register'}>Sign up</Link>
        </Flex>
        <OtherRegisterOption />
      </Form>
    </AuthLayout>
  )
}

export default Login
