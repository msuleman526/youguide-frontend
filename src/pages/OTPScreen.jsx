import React from 'react'
import AuthLayout from '../layouts/AuthLayout'
import { Button, Flex, Form, Input, Space } from 'antd'

const OTPScreen = () => {
  const onChange = text => {
    console.log('onChange:', text)
  }
  const sharedProps = {
    onChange,
  }
  return (
    <AuthLayout title={'Confirm'} backToLogin={true} marginTop="30px">
      <Form layout="vertical">
        <Flex justify="center">
          <Form.Item
            name={'otp'}
            label={`Please enter the 4-digit code sent to mi1084****@gmail.com`}
          >
            <Flex justify="center">
              <Input.OTP length={4} size="large" {...sharedProps} />
            </Flex>
          </Form.Item>
        </Flex>
        <Button type="primary" block>
          Confirm
        </Button>
      </Form>
    </AuthLayout>
  )
}

export default OTPScreen
