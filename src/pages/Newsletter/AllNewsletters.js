import { Table, Typography, message, Modal, Button } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

const AllNewsletters = () => {
  const theme = useRecoilValue(themeState);
  const [newsletters, setNewsletters] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [tableLoading, setTableLoading] = useState(false);

  const fetchNewsletters = async (page = 1, limit = 20) => {
    try {
      setTableLoading(true);
      const response = await ApiService.getAllNewsletters(page, limit);

      if (response.success) {
        setNewsletters(response.data);
        setPagination({
          current: response.pagination?.page || 1,
          pageSize: response.pagination?.limit || 20,
          total: response.pagination?.total || 0,
        });
      }
      setTableLoading(false);
    } catch (error) {
      setTableLoading(false);
      message.error(error?.response?.data?.message || 'Failed to fetch newsletters.');
      setNewsletters([]);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchNewsletters(newPagination.current, newPagination.pageSize);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this subscriber?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      setTableLoading(true);
      await ApiService.deleteNewsletter(id);
      message.success('Subscriber deleted successfully.');
      setNewsletters((prev) => prev.filter((item) => item._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (error) {
      message.error('Error deleting subscriber.');
    } finally {
      setTableLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
    },
    {
      title: 'Subscribed On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => moment(date).format('MMM DD, YYYY HH:mm'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmDelete(record._id)}
        />
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Newsletter Subscribers</Title>

      <CustomCard theme={theme}>
        <Table
          columns={columns}
          dataSource={newsletters}
          loading={tableLoading}
          rowKey="_id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} subscribers`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 730 }}
        />
      </CustomCard>
    </div>
  );
};

export default AllNewsletters;
