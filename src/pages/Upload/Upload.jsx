import { Button, Col, Flex, Row, Skeleton, Spin, Table, Typography } from 'antd'
import { HiOutlineUpload } from 'react-icons/hi'
import TransactionCard from '../../components/transaction/TransactionCard'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import {
  transactionColumns,
} from '../../components/transaction/TransactionData'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import UploadFormPopup from './UploadFormPopup'
import { useEffect, useRef, useState } from 'react'
import { GET_BANK_ACCOUNTS_LIST, GET_BANK_LIST, GET_UPLOADED_FILES_LIST } from '../../Utils/Apis'
import { handleErrors } from '../../Utils/Utils'

const Upload = () => {
  const theme = useRecoilValue(themeState)
  const columns = transactionColumns(theme)
  const [visible, setVisible] = useState(false)
  const [accountLoading, setAccountLoading] = useState(false)
  const [bankAccounts, setBankAccounts] = useState([])
  const scrollContainerRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setAccountLoading(true)
        let response = await GET_BANK_ACCOUNTS_LIST();
        if (response.isSuccess && response.data) {
          setBankAccounts(response.data);
        } else {
          setBankAccounts([]);
        }
        setAccountLoading(false)
      } catch (err) {
        setBankAccounts([]);
        setAccountLoading(false)
        handleErrors('Getting Banks', err);
      }
    };

    const fetchUploadedFiles = async () => {
      try {
        setTableLoading(true)
        let response = await GET_UPLOADED_FILES_LIST();
        if (response.isSuccess && response.data) {
          setUploadedFiles(response.data);
        } else {
          setUploadedFiles([]);
        }
        setTableLoading(false)
      } catch (err) {
        setUploadedFiles([]);
        setTableLoading(false)
        handleErrors('Getting Files', err);
      }
    };

    fetchBankAccounts()
    fetchUploadedFiles()
  }, [])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <CustomCard>
        <Flex justify="space-between" align="center" className="mb-2">
          <Typography.Title level={3} className="my-0 fw-500">
            Upload bank transactions
          </Typography.Title>
          <Button className="custom-primary-btn" type="primary" size="large" onClick={() => setVisible(true)}>
            <Flex gap={'small'} align="center">
              <span>Upload Transactions</span>
              <HiOutlineUpload size={20} color="#fff" />
            </Flex>
          </Button>
        </Flex>
        <Typography.Text className="text-gray">
          Why can’t you handle a simple task like uploading statement on time?
          It’s not rocket science! We rely on this app to keep track of our
          expenses and now everything is delayed because of your negligence. Do
          you even realize how important it is to stay on top ot our finance? This
          affects our entire family’s financial stability!
        </Typography.Text>
        <Row gutter={[16, 16]} style={{ marginBlock: '20px' }}>
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              whiteSpace: 'nowrap',
              paddingBottom: '10px'
            }}
            ref={scrollContainerRef}
          >
            {accountLoading ? (
              <Spin />
            ) : (
              bankAccounts.map((item, index) => (
                <div style={{ display: 'inline-block', padding: '0 8px', marginTop: '4px'}} key={index}>
                  <TransactionCard theme={theme} item={item} />
                </div>
              ))
            )}
          </div>
          <Col xs={24}>
            <Flex justify="end" align="center" gap={'small'}>
              <Button
                onClick={() => scroll('left')}
                style={{ backgroundColor: '#EAF3FD', borderColor: '#EAF3FD' }}
              >
                <FaArrowLeftLong color="#4A4A4C" />
              </Button>
              <Button type="primary" onClick={() => scroll('right')}>
                <FaArrowRightLong />
              </Button>
            </Flex>
          </Col>
        </Row>
        <Typography.Title level={3} className="fw-500">
          Previously Uploaded Transactions
        </Typography.Title>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={uploadedFiles}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </CustomCard>
      <UploadFormPopup bankAccounts={bankAccounts} visible={visible} setVisible={setVisible}/>
    </>
  )
}

export default Upload
