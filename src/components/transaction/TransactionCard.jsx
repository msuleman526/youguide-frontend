import { Button, Card, Flex, Image, Typography } from 'antd'
import meezanLogo from '../../assets/meezanLogo.png'

const TransactionCard = ({ item, theme }) => {
  const { image, title, lastDate, btnText } = item
  return (
    <Card
      style={{ boxShadow: theme === 'dark' && '0px 6px 32px 0px #31608A4D' }}
      className={
        theme === 'light' ? 'transaction-card' : 'transaction-card-dark'
      }
    >
      <Image
        src={meezanLogo}
        height={80}
        width={80}
        className="obj-cover"
        alt="meezan"
        preview={false}
      />
      <Typography.Title
        level={5}
        className="text-gray-2 fw-400"
        style={{ marginTop: '10px', marginBottom: '20px' }}
      >
        {title}
      </Typography.Title>
      <Flex gap={'small'} align="center" style={{ marginBottom: '10px' }}>
        <Typography.Title level={5} className="my-0 text-gray-2">
          Last Date On:
        </Typography.Title>
        <Typography.Title level={5} className="my-0 text-gray-3 fw-400">
          {lastDate}
        </Typography.Title>
      </Flex>
      <Button
        block
        size="large"
        type="primary"
        className="transaction-card-btn"
      >
        {btnText}
      </Button>
    </Card>
  )
}

export default TransactionCard
