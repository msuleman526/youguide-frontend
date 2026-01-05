import { Table, Typography, message, Tag, Card, Row, Col, Statistic } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import { MailOutlined, CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

const AllRequests = () => {
  const theme = useRecoilValue(themeState);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch contact requests
  const fetchRequests = async (page = 1, limit = 20) => {
    try {
      setTableLoading(true);
      const response = await ApiService.getAllContactRequests(page, limit);

      if (response.success) {
        setRequests(response.data);
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
      message.error(error?.response?.data?.message || 'Failed to fetch contact requests.');
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchRequests(newPagination.current, newPagination.pageSize);
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
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 150,
    },
    {
      title: 'Company',
      dataIndex: 'company_name',
      key: 'company_name',
      width: 150,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email_address',
      key: 'email_address',
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
      title: 'Interested In',
      dataIndex: 'interested_id',
      key: 'interested_id',
      width: 180,
      render: (text) => text || 'N/A',
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
      title: 'Additional Info',
      dataIndex: 'additional_information',
      key: 'additional_information',
      width: 200,
      render: (text) => text || 'N/A',
      ellipsis: true,
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
      <Title level={2}>All Contact Requests</Title>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Requests"
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

      {/* Requests Table */}
      <CustomCard theme={theme}>
        <Table
          columns={columns}
          dataSource={requests}
          loading={tableLoading}
          rowKey="_id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} requests`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </CustomCard>
    </div>
  );
};

export default AllRequests;
