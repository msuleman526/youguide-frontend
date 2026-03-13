import React, { useEffect, useState } from 'react';
import { Button, Flex, Table, Typography, Modal, Tag, Input, message, Image } from 'antd';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import LanguageGuidePopup from './LanguageGuidePopup';
import ApiService from '../../APIServices/ApiService';

const LanguageGuides = () => {
  const theme = useRecoilValue(themeState);
  const [guides, setGuides] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 200,
    total: 0,
  });
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchGuides(1, '');
  }, []);

  const fetchGuides = (page, q) => {
    setTableLoading(true);
    ApiService.getAllLanguageGuides(page, q)
      .then((response) => {
        setPagination({
          ...pagination,
          current: response.currentPage,
          total: response.totalGuides,
        });
        setGuides(response.guides);
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
        message.error(error?.response?.data?.message || 'Failed to load language guides.');
        setGuides([]);
      });
  };

  const deleteGuide = async (id) => {
    setTableLoading(true);
    try {
      await ApiService.deleteLanguageGuide(id);
      message.success('Language guide deleted successfully.');
      setGuides((prev) => prev.filter((g) => g._id !== id));
      setTableLoading(false);
    } catch (err) {
      message.error('Failed to delete language guide.');
      setTableLoading(false);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this language guide?',
      onOk: () => deleteGuide(id),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleAdd = () => {
    setEditingGuide(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingGuide(record);
    setIsModalVisible(true);
  };

  const onSave = () => {
    setIsModalVisible(false);
    setEditingGuide(null);
    fetchGuides(pagination.current, query);
  };

  const onTableChange = (val) => {
    setPagination(val);
    fetchGuides(val.current, query);
  };

  const onPressEnter = (e) => {
    setQuery(e.target.value);
    fetchGuides(1, e.target.value);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (imagePath) => (
        <Image src={imagePath} style={{ width: '120px', borderRadius: '10px' }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'In Language',
      dataIndex: 'in_language',
      key: 'in_language',
    },
    {
      title: 'To Language',
      dataIndex: 'to_language',
      key: 'to_language',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `€${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'volcano'}>{status ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'PDF',
      dataIndex: 'pdfPath',
      key: 'pdfPath',
      render: (pdfPath) =>
        pdfPath ? (
          <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => window.open(pdfPath, '_blank')}>
            View PDF
          </Tag>
        ) : (
          '-'
        ),
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

  return (
    <div>
      <Flex justify="space-between" align="center" className="mb-2">
        <div>
          <Typography.Title level={2} className="my-0 fw-500">
            Language Guides Management
          </Typography.Title>
          <Typography.Title level={4} className="my-0 fw-500">
            Manage all language guides
          </Typography.Title>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input placeholder="Search by name" onPressEnter={onPressEnter} />
          <Button className="custom-primary-btn" type="primary" size="large" onClick={handleAdd}>
            <span>Add Language Guide</span>
          </Button>
        </div>
      </Flex>
      <CustomCard>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={guides}
          loading={tableLoading}
          pagination={pagination}
          onChange={onTableChange}
          scroll={{ x: 'max-content' }}
          rowKey="_id"
        />
      </CustomCard>
      <LanguageGuidePopup
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingGuide(null);
        }}
        onSave={onSave}
        editingGuide={editingGuide}
      />
    </div>
  );
};

export default LanguageGuides;
