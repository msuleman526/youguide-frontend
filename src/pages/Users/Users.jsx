import { Button, Flex, Select, Table, Typography, Modal, Tag } from 'antd'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import { useState } from 'react'
import UsersPopup from './UsersPopup'

const Users = () => {
  const theme = useRecoilValue(themeState)
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'Admin', openBooks: 12, downloadBooks: 5, offlineView: 8, created_at: '2024-01-01' },
    { id: 2, name: 'Jane Smith', role: 'SuperAdmin', openBooks: 20, downloadBooks: 15, offlineView: 12, created_at: '2024-01-05' },
    { id: 3, name: 'Emily Johnson', role: 'User', openBooks: 5, downloadBooks: 2, offlineView: 3, created_at: '2024-02-10' },
    { id: 4, name: 'Michael Brown', role: 'Affiliate', openBooks: 8, downloadBooks: 3, offlineView: 5, created_at: '2024-02-15' }
  ])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedUserRole, setSelectedUserRole] = useState('all')
  const [popupVisible, setPopupVisible] = useState(false)

  const deleteUser = (userId) => {
    setTableLoading(true)
    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    } catch (err) {
      console.error('Deleting User', err)
    } finally {
      setTableLoading(false)
    }
  }

  const confirmDelete = (userId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: () => deleteUser(userId),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color='blue'>{role}</Tag>
      ),
    },
    {
      title: 'Open Books',
      dataIndex: 'openBooks',
      key: 'openBooks',
      render: (openBooks) => (
        <div className='book-badge'>
          {openBooks}
        </div>
      ),
    },
    {
      title: 'Download Books',
      key: 'downloadBooks',
      dataIndex: 'downloadBooks',
      render: (downloadBooks) => (
        <div className='book-badge'>
          {downloadBooks}
        </div>
      ),
    },
    {
      title: 'Offline View',
      key: 'offlineView',
      dataIndex: 'offlineView',
      render: (offlineView) => (
        <div className='book-badge'>
          {offlineView}
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => handleEdit(record.id)}>
            <FaEdit />
          </Button>
          <Button type="link" danger onClick={() => confirmDelete(record.id)}>
            <FaTrashAlt />
          </Button>
        </Flex>
      ),
    },
  ];

  const handleEdit = (id) => {
    // Handle edit functionality here
  }

  let addUser = (values) => {

  }

  // Filter users based on selected role
  const filteredUsers = selectedUserRole === 'all'
    ? users
    : users.filter(user => user.role === selectedUserRole);

  return (
    <>
    <div>
      <Flex justify="space-between" align="center" className="mb-2">
        <div>
          <Typography.Title level={2} className="my-0 fw-500">
            Users Management
          </Typography.Title>
          <Typography.Title level={4} className="my-0 fw-500">
            All users of you guide
          </Typography.Title>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <Flex justify="end" align="center" gap="small" className="mb-2">
            <Select
              defaultValue="all"
              style={{ width: '250px' }}
              className={
                theme === 'light'
                  ? 'header-search-input-light'
                  : 'header-search-input-dark'
              }
              onChange={value => setSelectedUserRole(value)}
            >
              <Select.Option key="all" value="all">
                All Roles
              </Select.Option>
              <Select.Option key="Admin" value="Admin">
                Admin
              </Select.Option>
              <Select.Option key="SuperAdmin" value="SuperAdmin">
                SuperAdmin
              </Select.Option>
              <Select.Option key="User" value="User">
                User
              </Select.Option>
              <Select.Option key="Affiliate" value="Affiliate">
                Affiliate
              </Select.Option>
            </Select>
          </Flex>
          <Button
            className="custom-primary-btn"
            type="primary"
            size="large"
            onClick={() => setPopupVisible(true)}
          >
            <Flex gap="small" align="center">
              <span>Create User</span>
            </Flex>
          </Button>
        </div>
      </Flex>
    </div>
    <CustomCard>
      <Table
        size="middle"
        className="custom_table"
        bordered
        columns={columns}
        dataSource={filteredUsers}
        loading={tableLoading}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </CustomCard>
    <UsersPopup visible={popupVisible} onClose={() => setPopupVisible(false)} onAddUser={addUser} />
    </>
  )
}

export default Users
