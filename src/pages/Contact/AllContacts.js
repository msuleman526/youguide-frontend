import { Table, Typography, message, Tag, Card, Row, Col, Statistic } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import { MailOutlined, CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

const AllContacts = () => {
  const theme = useRecoilValue(themeState);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch contacts
  const fetchContacts = async (page = 1, limit = 20) => {
    try {
      setTableLoading(true);
      const response = await ApiService.getAllContacts(page, limit);

      if (response.success) {
        setContacts(response.data);
        setStats(response.stats || {});
        setPagination({
          current: response.pagination?.page || 1,
          pageSize: response.pagination?.limit || 20,
          total: response.pagination?.total || 0,
        });
      }
      setTableLoading(false);
    } catch (error) {
      setTableLoading(false);
      message.error(error?.response?.data?.message || 'Failed to fetch contacts.');
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchContacts(newPagination.current, newPagination.pageSize);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'blue',
      in_progress: 'orange',
      resolved: 'green',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
      key: 'phone_no',
      width: 130,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      width: 250,
      render: (text) => text || 'N/A',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase().replace('_', ' ') : 'NEW'}
        </Tag>
      ),
    },
    {
      title: 'Read',
      dataIndex: 'is_read',
      key: 'is_read',
      width: 80,
      render: (isRead) => (
        <Tag color={isRead ? 'green' : 'red'}>
          {isRead ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => moment(date).format('MMM DD, YYYY HH:mm'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
  ];

  return (
    <div>
      <Title level={2}>All Contacts</Title>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Contacts"
              value={stats.total || 0}
              prefix={<MailOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Unread"
              value={stats.unread || 0}
              prefix={<MailOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="New"
              value={stats.new || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={stats.in_progress || 0}
              prefix={<SyncOutlined spin />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Contacts Table */}
      <CustomCard theme={theme}>
        <Table
          columns={columns}
          dataSource={contacts}
          loading={tableLoading}
          rowKey="_id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} contacts`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </CustomCard>
    </div>
  );
};

export default AllContacts;
