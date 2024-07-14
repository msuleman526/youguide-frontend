import { Button, Flex, Modal, Typography } from 'antd'
import React from 'react'
import { EmailConfirmIcon } from './icons/AllSvgIcon'

const ConfirmModal = ({ visible, onCancel }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      closable={false}
      closeIcon={false}
      footer={null}
      centered
    >
      <Flex
        justify="center"
        align="center"
        vertical
        gap={'10px'}
        className="w-100"
        style={{ paddingBlock: '30px' }}
      >
        <EmailConfirmIcon />
        <Typography.Title level={3}>Check Your Email</Typography.Title>
        <Typography.Text style={{ textAlign: 'center', marginBottom: '20px' }}>
          We already have sent you the Reset Password email to
          isma****@gmail.com, please check it
        </Typography.Text>
        <Button style={{ height: '60px' }} size="large" type="primary">
          Open Your Email
        </Button>
      </Flex>
    </Modal>
  )
}

export default ConfirmModal
