import React, { useEffect, useState } from 'react'
import { Modal, Button, Typography } from 'antd'
import { DesktopOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const MOBILE_BREAKPOINT = 1024

const MobileWarningModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setOpen(true)
      }
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <Modal
      open={open}
      centered
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="ok" type="primary" onClick={() => setOpen(false)}>
          I Understand
        </Button>,
      ]}
      width={Math.min(window.innerWidth - 32, 420)}
      styles={{ body: { textAlign: 'center', padding: '8px 4px' } }}
    >
      <DesktopOutlined style={{ fontSize: 48, color: '#29b8e3', marginBottom: 12 }} />
      <Title level={4} style={{ marginTop: 0 }}>
        Desktop or Laptop Recommended
      </Title>
      <Paragraph style={{ marginBottom: 0 }}>
        The admin panel will work properly on a desktop or laptop. Please open
        this page on a larger screen for the best experience.
      </Paragraph>
    </Modal>
  )
}

export default MobileWarningModal
