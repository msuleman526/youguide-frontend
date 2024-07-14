import React from 'react'
import { Button, Col, Flex, Image, Row } from 'antd'
import googleSvg from '../assets/google.svg'
import linkdinSvg from '../assets/linkedin.svg'

const OtherRegisterOption = () => {
  let buttonStyle = {
    padding: '6px 20px',
    maxHeight: 'auto',
    minHeight: 'auto',
    height: 'auto',
  }
  return (
    <Row className="w-100" gutter={[12, 12]} style={{ marginBlock: '20px' }}>
      <Col flex={1}>
        <Button size="large" style={buttonStyle} block>
          <Flex gap={'small'} align="center" wrap="wrap">
            <Flex flex={100}>
              <Image src={googleSvg} preview={false} width={40} />
            </Flex>
            <Flex flex={250}>Continue with Google</Flex>
          </Flex>
        </Button>
      </Col>
      <Col flex={1}>
        <Button style={buttonStyle} block>
          <Flex gap={'small'} align="center" wrap="wrap">
            <Flex flex={100}>
              <Image src={linkdinSvg} preview={false} width={40} />
            </Flex>
            <Flex flex={250}>Continue with LinkedIn</Flex>
          </Flex>
        </Button>
      </Col>
    </Row>
  )
}

export default OtherRegisterOption
