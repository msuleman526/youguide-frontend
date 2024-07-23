import { Flex, Image, Switch, Typography } from 'antd'
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
            //onClick={() => editRecord(record.key)}
            />
            <RxDownload
              size={18}
              color={iconColor}
            //onClick={() => downloadRecord(record.key)}
            />
            <FiTrash2
              size={18}
              color="#E14545"
            //onClick={() => deleteRecord(record.key)}
            />
          </Flex>
        )
      },
    },
  ]

export const membersColumns = (
  theme,
  editRecord,
  downloadRecord,
  deleteRecord
) => [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone no',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
            //onClick={() => editRecord(record.key)}
            />
            <RxDownload
              size={18}
              color={iconColor}
            //onClick={() => downloadRecord(record.key)}
            />
            <FiTrash2
              size={18}
              color="#E14545"
            //onClick={() => deleteRecord(record.key)}
            />
          </Flex>
        )
      },
    },
  ]


export const groupsAndBanksColumns = (
  theme,
  editRecord,
  deleteRecord
) => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <Flex gap="10px" align="center">
            <Image preview={false} src={record.icon} style={{ width: '30px', border: '1px solid #686868', borderRadius: '17px' }} />
            <Typography>{record.name}</Typography>
          </Flex>
        )
      },
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
              onClick={() => editRecord(record.bankID)}
            />
            <FiTrash2
              size={18}
              color="#E14545"
            //onClick={() => deleteRecord(record.key)}
            />
          </Flex>
        )
      },
    },
  ]


export const categoryGroupColumns = (
  theme,
  editRecord,
  downloadRecord,
  deleteRecord
) => [
    {
      title: 'Category Group',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'This FY',
      dataIndex: 'thisfy',
      key: 'thisfy',
    },
    {
      title: 'This CY',
      dataIndex: 'thiscy',
      key: 'thiscy',
    },
    {
      title: 'May 2023',
      dataIndex: 'may',
      key: 'may',
    },
    {
      title: 'April 2023',
      dataIndex: 'april',
      key: 'april',
    },
  ]

export const flaggedColumns = (
  theme,
  editRecord,
  downloadRecord,
  deleteRecord
) => [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: (text, record) => <Switch checked={record.checkbox} />,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
  ]

export const groupsDataSource = [
  {
    key: '1',
    name: "Food",
  },
  {
    key: '2',
    name: "Health Expenses",
  },
  {
    key: '3',
    name: "Home Expenses",
  },
  {
    key: '4',
    name: "Ignored Transactions",
  },
  {
    key: '5',
    name: "Investment Costs",
  },
  {
    key: '6',
    name: "Investment Income",
  },
  {
    key: '7',
    name: "Other Miscellaneous Expenses",
  },
  {
    key: '8',
    name: "Other Miscellaneous Income",
  },
  {
    key: '9',
    name: "Personal - Debt",
  },
  {
    key: '10',
    name: "Personal - Expenses",
  },
  {
    key: '11',
    name: "Personal - Other Expenses",
  },
];

export const flaggedCategoryDataSoruce = [
  {
    key: '1',
    checkbox: true,
    date: '1/05/2023	',
    description: 'Loan Repayment LN REPAY 468442250 - alsfjasdl	',
    amount: '-$1,602.42',
    category: '2016 Phillip Island',
  },
  {
    key: '1',
    checkbox: false,
    date: '1/05/2023	',
    description: 'Loan Repayment LN REPAY 468442250 - alsfjasdl	',
    amount: '-$1,602.42',
    category: '2016 Phillip Island',
  },
  {
    key: '1',
    checkbox: true,
    date: '1/05/2023	',
    description: 'Loan Repayment LN REPAY 468442250 - alsfjasdl	',
    amount: '-$1,602.42',
    category: '2016 Phillip Island',
  },
]


export const membersDataSource = [
  {
    key: '1',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '3',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '4',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '5',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '6',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '7',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '8',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '9',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  },
  {
    key: '10',
    name: 'Muhammad Suleman',
    email: 'msuleman526',
    phone: '+92 316 5282707',
    status: 'Active',
  }
]

export const categoryGroupDataSoruce = [
  {
    key: '1',
    group: 'House',
    thisfy: '$0.0',
    thiscy: '$0.0',
    may: '-$2314',
    april: '-$1314',
  },
  {
    key: '1',
    group: 'Food',
    thisfy: '$0.0',
    thiscy: '$0.0',
    may: '-$2314',
    april: '-$1314',
  },
  {
    key: '1',
    group: 'Bills',
    thisfy: '$0.0',
    thiscy: '$0.0',
    may: '-$314',
    april: '-$297',
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
  {
    id: 5,
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
