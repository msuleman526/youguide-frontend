import React, { useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import { Button, Flex, Form, Input, Typography } from 'antd'
import ConfirmModal from '../components/ConfirmModal'

const ForgetPassword = () => {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
  return (
    <AuthLayout title={'Forgot Password'} backToLogin={true} customCenterClassName="auth-card-height">
      <Flex vertical justify="center" gap={'40px'}>
        <Flex justify="center" style={{ marginTop: '30px' }}>
          <Typography.Text
            style={{ maxWidth: '300px', width: '100%', textAlign: 'center' }}
          >
            Please enter your email address to receive your verification code
          </Typography.Text>
        </Flex>
        <Form layout="vertical">
          <Form.Item name={'otp'} label={`Email`}>
            <Input placeholder="Your Email" />
          </Form.Item>
          <Button type="primary" block onClick={handleOpenModal}>
            Send Code
          </Button>
        </Form>
      </Flex>
      <ConfirmModal visible={showModal} onCancel={handleCloseModal} />
    </AuthLayout>
  )
}

export default ForgetPassword
