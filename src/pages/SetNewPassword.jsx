import { useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import { Button, Flex, Form, Input, Typography } from 'antd'

const SetNewPassword = () => {
  const [isSetPassword, setIsSetPassword] = useState(false)
  return (
    <AuthLayout title={'Set New Password'} backToLogin={true}>
      <Flex vertical justify="center" gap={'30px'}>
        <Flex justify="center" style={{ marginTop: '20px' }}>
          <Typography.Text
            style={{
              maxWidth: isSetPassword ? '420px' : '300px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {isSetPassword
              ? 'Your password has been successfully reset. Click below to log in magically.'
              : '  Your new password must be different to previously used passwords.'}
          </Typography.Text>
        </Flex>
        <Form layout="vertical">
          {!isSetPassword && (
            <>
              <Form.Item name={'password'} label={`Password`}>
                <Input.Password placeholder="***********" />
              </Form.Item>
              <Form.Item name={'confirm_password'} label={`Confirm Password`}>
                <Input.Password placeholder="***********" />
              </Form.Item>{' '}
            </>
          )}
          <Button
            type="primary"
            block
            onClick={() => setIsSetPassword(prev => !prev)}
          >
            {isSetPassword ? 'Continue' : 'Reset Password'}
          </Button>
        </Form>
      </Flex>
    </AuthLayout>
  )
}

export default SetNewPassword
