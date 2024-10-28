import { Button, Col, Flex, Row, Select, Skeleton, Spin, Table, Typography, Modal, Tag } from 'antd'
import { HiOutlineUpload } from 'react-icons/hi'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import { useEffect, useState } from 'react'
import { handleErrors } from '../../Utils/Utils'

const RoleManagement = () => {
  const theme = useRecoilValue(themeState)
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', slug: 'admin', status: true, created_at: '2024-01-01' },
    { id: 2, name: 'SuperAdmin', slug: 'superadmin', status: true, created_at: '2024-01-01' },
    { id: 3, name: 'Users', slug: 'users', status: true, created_at: '2024-01-01' },
    { id: 4, name: 'Affiliate', slug: 'affiliate', status: false, created_at: '2024-01-01' }
  ])
  const [tableLoading, setTableLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedRoleStatus, setSelectedRoleStatus] = useState('all')
  const [deletingRoleId, setDeletingRoleId] = useState(null)

  const deleteRole = async (roleId) => {
    setTableLoading(true)
    try {
      setRoles(prevRoles => prevRoles.filter(role => role.id !== roleId))
    } catch (err) {
      handleErrors('Deleting Role', err)
    } finally {
      setTableLoading(false)
    }
  }

  const confirmDelete = (roleId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      onOk: () => deleteRole(roleId),
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
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status ? 'blue' : 'red'}>{record.status ? 'Active' : 'Inactive'}</Tag>
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
        <Flex gap="small">
          <Button type="link" onClick={() => handleEdit(record.id)}>
            <FaEdit />=
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

  // Filter roles based on selected status
  const filteredRoles = selectedRoleStatus === 'all'
    ? roles
    : roles.filter(role => role.status === (selectedRoleStatus === 'active'));

  return (
    <>
    <div>
      <Flex justify="space-between" align="center" className="mb-2">
        <div>
          <Typography.Title level={2} className="my-0 fw-500">
            Role Management
          </Typography.Title>
          <Typography.Title level={4} className="my-0 fw-500">
            Manage all roles in you guide.
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
              onChange={value => setSelectedRoleStatus(value)}
            >
              <Select.Option key="all" value="all">
                All Roles
              </Select.Option>
              <Select.Option key="active" value="active">
                Active Roles
              </Select.Option>
              <Select.Option key="inactive" value="inactive">
                Inactive Roles
              </Select.Option>
            </Select>
          </Flex>
          <Button
            className="custom-primary-btn"
            type="primary"
            size="large"
            onClick={() => setVisible(true)}
          >
            <Flex gap="small" align="center">
              <span>Create Role</span>
              <HiOutlineUpload size={20} color="#fff" />
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
        dataSource={filteredRoles}
        loading={tableLoading}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </CustomCard></>
  )
}

export default RoleManagement
