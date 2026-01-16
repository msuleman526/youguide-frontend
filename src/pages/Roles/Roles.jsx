import { Button, Col, Flex, Row, Select, Skeleton, Spin, Table, Typography, Modal, Tag, message } from 'antd'
import { HiOutlineUpload } from 'react-icons/hi'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import { useEffect, useState } from 'react'
import { handleErrors } from '../../Utils/Utils'
import ApiService from '../../APIServices/ApiService'
import RolesPopup from './RolesPopup'
import PageTourWrapper from '../../components/PageTourWrapper'
import { TOUR_PAGES } from '../../Utils/TourConfig'

const RoleManagement = () => {
  const theme = useRecoilValue(themeState)
  const [roles, setRoles] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedRoleStatus, setSelectedRoleStatus] = useState('all')
  const [deletingRoleId, setDeletingRoleId] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [popupType, setPopupType] = useState("Add")

  useEffect(() => {
      setTableLoading(true)
      ApiService.getAllRoles().then((response) => {
          setRoles(response)
          setTableLoading(false)
      }).catch(error => {
          setTableLoading(false)
          message.error(error?.response?.data?.message || "Roles Failed.")
          setRoles([])
      });
  }, [])

  const deleteRole = async (roleId) => {
    setTableLoading(true)
    try {
      await ApiService.deleteRole(roleId)
      message.success('Role deleted successfully.')
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId))
    } catch (err) {
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
      render: (_, record) => (
         new Date(record.created_at).toLocaleString()
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => handleEdit(record)}>
            <FaEdit />=
          </Button>
          {/* <Button type="link" danger onClick={() => confirmDelete(record._id)}>
            <FaTrashAlt />
          </Button> */}
        </Flex>
      ),
    },
  ];

  const handleEdit = (role) => {
      setSelectedRole(role)
      setPopupType("Edit")
      setVisible(true)
  }

  const onAddRole = () => {
    setPopupType("Add")
    setVisible(true)
  }

  const onSaveRole = (role) => {
    if (popupType === "Edit") {
      setRoles(prevRoles => prevRoles.map(r => {
        if (r._id === role._id) {
          return role
        }
        return r
      }))
    }else{
      setRoles(prevRoles => [...prevRoles, role])
    }
    setVisible(false)
  }

  const filteredRoles = selectedRoleStatus === 'all'
    ? roles
    : roles.filter(role => role.status === (selectedRoleStatus === 'active'));

  return (
    <PageTourWrapper pageName={TOUR_PAGES.ROLES}>
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
            className="custom-primary-btn roles-add-button"
            type="primary"
            size="large"
            onClick={onAddRole}
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
        className="custom_table roles-table"
        bordered
        columns={columns}
        dataSource={filteredRoles}
        loading={tableLoading}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </CustomCard>
    <RolesPopup open={visible} setOpen={() => setVisible(false)} onSaveRole={onSaveRole} role={selectedRole} type={popupType} />
    </PageTourWrapper>
  )
}

export default RoleManagement
