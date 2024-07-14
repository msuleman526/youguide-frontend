import { Flex, Image } from 'antd'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { RxDownload } from 'react-icons/rx'
import meezanSmallImg from '../../assets/meezan_small.png'
import { HiChevronRight } from 'react-icons/hi'

export const transactionColumns = (
  theme,
  editRecord,
  downloadRecord,
  deleteRecord
) => [
  {
    title: 'Bank Account',
    dataIndex: 'bankAccount',
    key: 'bankAccount',
    render: text => {
      return (
        <Flex gap={'10px'} align="center">
          <Image src={meezanSmallImg} alt="meezan" />
          <span>{text}</span>
          <HiChevronRight color="#5E5F61" size={18} />
        </Flex>
      )
    },
  },
  {
    title: 'Transactions From',
    dataIndex: 'transactionsFrom',
    key: 'transactionsFrom',
  },
  {
    title: 'Transaction To',
    dataIndex: 'transactionTo',
    key: 'transactionTo',
  },
  {
    title: 'Total Record Imported',
    dataIndex: 'totalRecordImported',
    key: 'totalRecordImported',
    render: (text, record) => <span>{record.totalRecordImported}</span>,
  },
  {
    title: 'Import Date',
    dataIndex: 'importDate',
    key: 'importDate',
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
    render: (text, record) => {
      let iconColor = theme === 'light' ? '#A8AAAD' : '#D2D4D8'
      return (
        <Flex gap="10px" align="center">
          <FiEdit
            size={18}
            color={iconColor}
            onClick={() => editRecord(record.key)}
          />
          <RxDownload
            size={18}
            color={iconColor}
            onClick={() => downloadRecord(record.key)}
          />
          <FiTrash2
            size={18}
            color="#E14545"
            onClick={() => deleteRecord(record.key)}
          />
        </Flex>
      )
    },
  },
]

export const transactionCardData = [
  {
    id: 1,
    title: 'Meezan bank',
    lastDate: '03/05/2024',
    btnText: 'Drop to Upload',
  },
  {
    id: 2,
    title: 'Meezan bank',
    lastDate: '03/05/2024',
    btnText: 'Drop to Upload',
  },
  {
    id: 3,
    title: 'Meezan bank',
    lastDate: '03/05/2024',
    btnText: 'Drop to Upload',
  },
  {
    id: 4,
    title: 'Meezan bank',
    lastDate: '03/05/2024',
    btnText: 'Drop to Upload',
  },
]

export const transactionTableData = [
  {
    key: '1',
    bankAccount: 'Meezan Bank',
    transactionsFrom: '22/04/2024',
    transactionTo: '22/04/2024',
    totalRecordImported: 'Fill x 48',
    importDate: '22/04/2024',
  },
  {
    key: '2',
    bankAccount: 'Meezan Bank',
    transactionsFrom: '22/04/2024',
    transactionTo: '22/04/2024',
    totalRecordImported: 4542,
    importDate: '22/04/2024',
  },
  {
    key: '3',
    bankAccount: 'Meezan Bank',
    transactionsFrom: '22/04/2024',
    transactionTo: '22/04/2024',
    totalRecordImported: 454,
    importDate: '22/04/2024',
  },
  {
    key: '4',
    bankAccount: 'Meezan Bank',
    transactionsFrom: '22/04/2024',
    transactionTo: '22/04/2024',
    totalRecordImported: 345,
    importDate: '22/04/2024',
  },
  {
    key: '5',
    bankAccount: 'Meezan Bank',
    transactionsFrom: '22/04/2024',
    transactionTo: '22/04/2024',
    totalRecordImported: 744,
    importDate: '22/04/2024',
  },
  {
    key: '6',
    bankAccount: 'Meezan Bank',
    transactionsFrom: '22/04/2024',
    transactionTo: '22/04/2024',
    totalRecordImported: 454,
    importDate: '22/04/2024',
  },
]
