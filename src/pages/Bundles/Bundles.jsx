import React, { useEffect, useState } from 'react';
import { Button, Flex, Table, Typography, Modal, Tag, Input, message, Image, Tooltip } from 'antd';
import { FaEdit, FaTrashAlt, FaRegCopy } from 'react-icons/fa';
import CustomCard from '../../components/Card';
import BundlePopup from './BundlePopup';
import ApiService from '../../APIServices/ApiService';

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchBundles('');
  }, []);

  const fetchBundles = (q) => {
    setTableLoading(true);
    ApiService.getBundles(q ? { search: q } : {})
      .then((response) => {
        setBundles(response.data || []);
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
        message.error(error?.response?.data?.message || 'Failed to load bundles.');
        setBundles([]);
      });
  };

  const deleteBundle = async (id) => {
    setTableLoading(true);
    try {
      await ApiService.deleteBundle(id);
      message.success('Bundle deleted successfully.');
      setBundles((prev) => prev.filter((b) => b._id !== id));
      setTableLoading(false);
    } catch (err) {
      message.error('Failed to delete bundle.');
      setTableLoading(false);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this bundle?',
      onOk: () => deleteBundle(id),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleAdd = () => {
    setEditingBundle(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBundle(record);
    setIsModalVisible(true);
  };

  const onSave = () => {
    setIsModalVisible(false);
    setEditingBundle(null);
    fetchBundles(query);
  };

  const onPressEnter = (e) => {
    setQuery(e.target.value);
    fetchBundles(e.target.value);
  };

  const copy = (url) => {
    navigator.clipboard.writeText(url).then(
      () => message.success('Link copied!'),
      () => message.error('Could not copy link.'),
    );
  };

  const LinkCell = ({ label, url }) => (
    <Flex align="center" gap={6} style={{ marginBottom: 4 }}>
      <Tag color="geekblue" style={{ margin: 0 }}>{label}</Tag>
      <Typography.Text
        ellipsis
        style={{ maxWidth: 230, fontSize: 12 }}
        title={url}
      >
        {url}
      </Typography.Text>
      <Tooltip title="Copy">
        <Button type="text" size="small" icon={<FaRegCopy />} onClick={() => copy(url)} />
      </Tooltip>
    </Flex>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'coverImage',
      key: 'coverImage',
      render: (img) => (img ? <Image src={img} style={{ width: '110px', borderRadius: '10px' }} /> : '-'),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={type === 'city' ? 'purple' : 'cyan'}>{type}</Tag>,
    },
    {
      title: 'Contents',
      key: 'contents',
      render: (_, r) => (
        <Flex vertical gap={2}>
          <span>{(r.bookIds || []).length} travel guide(s)</span>
          <span>{(r.languageGuideIds || []).length} language guide(s)</span>
          <span>{r.esim ? `eSIM: ${r.esim.name || r.esim.packageCode}` : 'No eSIM'}</span>
        </Flex>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `€${price}`,
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty) => {
        const q = qty || 0;
        return q > 0
          ? <Tag color="blue">{q} in stock</Tag>
          : <Tag color="red">Sold Out</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status ? 'green' : 'volcano'}>{status ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Public Links',
      key: 'links',
      render: (_, r) => (
        <Flex vertical>
          <LinkCell label="Detail" url={r.detailUrl} />
          <LinkCell label="Checkout" url={r.checkoutUrl} />
        </Flex>
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
            Bundles
          </Typography.Title>
          <Typography.Title level={4} className="my-0 fw-500">
            Curate travel guide + language guide + eSIM packages
          </Typography.Title>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input placeholder="Search by title" onPressEnter={onPressEnter} />
          <Button className="custom-primary-btn" type="primary" size="large" onClick={handleAdd}>
            <span>Add Bundle</span>
          </Button>
        </div>
      </Flex>
      <CustomCard>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={bundles}
          loading={tableLoading}
          scroll={{ x: 'max-content' }}
          rowKey="_id"
        />
      </CustomCard>
      <BundlePopup
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingBundle(null);
        }}
        onSave={onSave}
        editingBundle={editingBundle}
      />
    </div>
  );
};

export default Bundles;
