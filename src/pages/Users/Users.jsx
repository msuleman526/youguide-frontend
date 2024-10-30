import { Button, Flex, Select, Table, Typography, Modal, Tag, message } from 'antd'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import { useEffect, useState } from 'react'
import UsersPopup from './UsersPopup'
import ApiService from '../../APIServices/ApiService'

const Users = () => {
  const theme = useRecoilValue(themeState)
  const [users, setUsers] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedUserRole, setSelectedUserRole] = useState('all')
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupType, setPopupType] = useState("Add")
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
      setTableLoading(true)
      ApiService.getAllUsers().then((response) => {
        console.log(response)
          setUsers(response)
          setTableLoading(false)
      }).catch(error => {
          setTableLoading(false)
          message.error(error?.response?.data?.message || "Users Failed.")
          setUsers([])
      });
  }, [])

  const deleteUser = async (userId) => {
    setTableLoading(true)
    try {
      await ApiService.deleteUser(userId)
      message.success('User deleted successfully.')
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
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
      render: (index, record) => (
        <Tag color='blue'>{record.firstName + " " + record.lastName}</Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color='blue'>{role.name}</Tag>
      ),
    },
    {
      title: 'Open Books',
      dataIndex: 'openBooks',
      key: 'openBooks',
      render: (openBooks) => (
        <div className='book-badge'>
          {openBooks || "0"}
        </div>
      ),
    },
    {
      title: 'Download Books',
      key: 'downloadBooks',
      dataIndex: 'downloadBooks',
      render: (downloadBooks) => (
        <div className='book-badge'>
          {downloadBooks || "0"}
        </div>
      ),
    },
    {
      title: 'Offline View',
      key: 'offlineView',
      dataIndex: 'offlineView',
      render: (offlineView) => (
        <div className='book-badge'>
          {offlineView || "0"}
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => handleEdit(record)}>
            <FaEdit />
          </Button>
          <Button type="link" danger onClick={() => confirmDelete(record._id)}>
            <FaTrashAlt />
          </Button>
        </Flex>
      ),
    },
  ];

  let addUser = (user) => {
    if (popupType === "Edit") {
      setUsers(prevUsers => prevUsers.map(r => {
        if (r._id === user._id) {
          return user
        }
        return r
      }))
    }else{
      setUsers(prevUsers => [...prevUsers, user])
    }
    setPopupVisible(false)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setPopupType("Edit")
    setPopupVisible(true)
  }

  const onAddUser= () => {
    setPopupType("Add")
    setPopupVisible(true)
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
            onClick={onAddUser}
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
    <UsersPopup open={popupVisible} type={popupType} user={selectedUser} setOpen={() => setPopupVisible(false)} onSaveUser={addUser} />
    </>
  )
}

export default Users
