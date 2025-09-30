import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Tag,
  Tooltip,
  Row,
  Col,
  Divider,
  Badge
} from 'antd';
import {
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import axios from 'axios';
import ApiService from '../APIServices/ApiService';

const { Title, Text } = Typography;

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'team-admin' or 'team-user'
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [form] = Form.useForm();

  const fetchTeams = async () => {
    setLoading(true)
    ApiService.getTeams().then((response) => {
        setTeams(response);
        setLoading(false)
    }).catch((error) => {
        console.error('Error fetching teams:', error);
        message.error('Error fetching teams');
        setLoading(false)
    })
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleExpand = (expanded, record) => {
    const keys = expanded 
      ? [...expandedRows, record.teamAdmin._id]
      : expandedRows.filter(key => key !== record.teamAdmin._id);
    setExpandedRows(keys);
  };

  const showModal = (type, teamId = '') => {
    setModalType(type);
    setSelectedTeamId(teamId);
    setModalVisible(true);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
      const payload = { ...values };
      
      if (modalType === 'team-user') {
        payload.team_id = selectedTeamId;
      }

      if (modalType === 'team-admin') {
        ApiService.saveTeamAdmin(payload).then((response) => {
            message.success('Team Admin created successfully');
            form.resetFields();
            setModalVisible(false);
            fetchTeams();
        }).catch((error) => {
            console.error('Error creating team admin:', error);
            setModalVisible(false);
            message.error(error.response?.data?.message || 'Error creating team admin');
        })
      }else{
        ApiService.saveTeamUser(payload).then((response) => {
            message.success('Team User created successfully');
            form.resetFields();
            setModalVisible(false);
            fetchTeams();
        }).catch((error) => {
            console.error('Error creating team user:', error);
            message.error(error.response?.data?.message || 'Error creating team user');
            setModalVisible(false);
        })
      }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    ApiService.updateTeamStatus(userId, { status: !currentStatus }).then((response) => {
        console.log(response);
        message.success('Status updated successfully');
        fetchTeams();
    }).catch((error) => {
        console.error('Error updating status:', error);
        message.error('Error updating status');
    })
  };

  const handleTeamLimitChange = async (teamAdminId, newLimit) => {
    try {
      await axios.patch(`/api/team-admin/${teamAdminId}/limit`, { team_limit: newLimit });
      message.success('Team limit updated successfully');
      fetchTeams();
    } catch (error) {
      console.error('Error updating team limit:', error);
      message.error('Error updating team limit');
    }
  };

  const expandedRowRender = (record) => {
    const teamUserColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (_, user) => (
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <Text>{user.firstName} {user.lastName}</Text>
          </Space>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (email) => (
          <Space>
            <MailOutlined />
            <Text copyable>{email}</Text>
          </Space>
        ),
      },
      {
        title: 'Phone',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (phone) => (
          <Space>
            <PhoneOutlined />
            <Text>{phone || 'N/A'}</Text>
          </Space>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status, user) => (
          <Switch
            checked={status}
            onChange={() => handleStatusToggle(user._id, status)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        ),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => new Date(date).toLocaleDateString(),
      },
    ];

    return (
      <div style={{ margin: '16px 0' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={5}>
              <TeamOutlined /> Team Members ({record.teamUsers.length})
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal('team-user', record.teamAdmin._id)}
              disabled={record.currentCount >= record.teamAdmin.team_limit}
            >
              Add Team User
            </Button>
          </Col>
        </Row>
        
        <Table
          columns={teamUserColumns}
          dataSource={record.teamUsers}
          pagination={false}
          rowKey="_id"
          size="small"
          locale={{
            emptyText: 'No team members yet'
          }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: 'Team Admin',
      dataIndex: 'teamAdmin',
      key: 'teamAdmin',
      render: (admin) => (
        <Space>
          <TeamOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
          <div>
            <Text strong>{admin.firstName} {admin.lastName}</Text>
            <br />
            <Text type="secondary" copyable>{admin.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'teamAdmin',
      key: 'phone',
      render: (admin) => (
        <Space>
          <PhoneOutlined />
          <Text>{admin.phoneNumber || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Team Limit',
      dataIndex: 'teamAdmin',
      key: 'teamLimit',
      render: (admin) => (
        <InputNumber
          min={1}
          max={100}
          value={admin.team_limit}
          onChange={(value) => handleTeamLimitChange(admin._id, value)}
          style={{ width: '80px' }}
        />
      ),
    },
    {
      title: 'Team Count',
      dataIndex: 'currentCount',
      key: 'currentCount',
      render: (count, record) => {
        const limit = record.teamAdmin.team_limit;
        const color = count >= limit ? 'red' : count > limit * 0.8 ? 'orange' : 'green';
        return (
          <Badge
            count={`${count}/${limit}`}
            style={{ backgroundColor: color }}
          />
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'teamAdmin',
      key: 'status',
      render: (admin) => (
        <Switch
          checked={admin.status}
          onChange={() => handleStatusToggle(admin._id, admin.status)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'teamAdmin',
      key: 'created',
      render: (admin) => new Date(admin.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>
            <TeamOutlined /> Teams Management
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => showModal('team-admin')}
          >
            Add Team Admin
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={teams}
          loading={loading}
          rowKey={(record) => record.teamAdmin._id}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRows,
            onExpand: handleExpand,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={(e) => onExpand(record, e)} />
              ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} teams`,
          }}
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        title={
          <Space>
            {modalType === 'team-admin' ? <TeamOutlined /> : <UserOutlined />}
            {modalType === 'team-admin' ? 'Add Team Admin' : 'Add Team User'}
          </Space>
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: 'Please enter first name!' },
                  { min: 2, message: 'First name must be at least 2 characters!' }
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: 'Please enter last name!' },
                  { min: 2, message: 'Last name must be at least 2 characters!' }
                ]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter email address"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                message: 'Password must contain uppercase, lowercase, number, and special character!'
              }
            ]}
            extra="Must contain uppercase, lowercase, number, and special character"
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter phone number (optional)"
            />
          </Form.Item>

          {modalType === 'team-admin' && (
            <Form.Item
              label="Team Limit"
              name="team_limit"
              initialValue={5}
              rules={[
                { required: true, message: 'Please enter team limit!' },
                { type: 'number', min: 1, max: 100, message: 'Team limit must be between 1 and 100!' }
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                placeholder="Enter team limit"
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleModalCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create {modalType === 'team-admin' ? 'Team Admin' : 'Team User'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teams;