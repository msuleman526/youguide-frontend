import { Button, Col, Flex, Row, Select, Skeleton, Spin, Table, Typography, Modal, Tag, message } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import VendorPopup from './VendorPopup';
import moment from 'moment';

const VendorManagement = () => {
  const theme = useRecoilValue(themeState);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [popupType, setPopupType] = useState('Add');

  useEffect(() => {
    setTableLoading(true);
    getVendors()

    ApiService.getAllCategories()
      .then((response) => setCategories(response))
      .catch(() => message.error('Failed to fetch categories.'));
  }, []);

  let getVendors = () => {
    ApiService.getAllVendorSubscriptions()
    .then((response) => {
      console.log(response)
      setVendors(response);
      setTableLoading(false);
    })
    .catch((error) => {
      setTableLoading(false);
      message.error(error?.response?.data?.message || 'Failed to fetch vendors.');
      setVendors([]);
    });
  }

  const deleteVendor = async (vendorId) => {
    setTableLoading(true);
    try {
      await ApiService.deleteVendorSubsubscription(vendorId);
      message.success('Vendor deleted successfully.');
      setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
    } catch (err) {
      message.error('Failed to delete vendor.');
    } finally {
      setTableLoading(false);
    }
  };

  const confirmDelete = (vendorId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this vendor?',
      onOk: () => deleteVendor(vendorId),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const columns = [
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Subscription End Date',
      dataIndex: 'subscriptionEndDate',
      key: 'subscriptionEndDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'No of Clicks',
      dataIndex: 'numberOfClicks',
      key: 'numberOfClicks',
    },
    {
      title: 'Pending Clicks',
      dataIndex: 'pendingClicks',
      key: 'pendingClicks',
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories) => (
        <>
          {categories.map((category) => (
            <Tag key={category._id}>{category.name}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const isInactive =
          new Date(record.subscriptionEndDate) < new Date() ||
          record.pendingClicks <= 0;
        return (
          <Tag color={isInactive ? 'red' : 'green'}>
            {isInactive ? 'Inactive' : 'Active'}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => handleView(record)}>
            <FaEye />
          </Button>
          <Button type="link" danger onClick={() => confirmDelete(record._id)}>
            <FaTrashAlt />
          </Button>
        </Flex>
      ),
    },
  ];

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setPopupType('Edit');
    setVisible(true);
  };

  const handleView = (vendor) => {
    window.open("subscription-guides/"+vendor._id, '_blank');
  };

  const onAddVendor = () => {
    setPopupType('Add');
    setVisible(true);
  };

  const onSaveVendor = (vendor) => {
    if (popupType === 'Edit') {
      setVendors((prev) =>
        prev.map((v) => (v._id === vendor._id ? vendor : v))
      );
    } else {
      getVendors()
    }
    setVisible(false);
  };

  return (
    <>
      <div>
        <Flex justify="space-between" align="center" className="mb-2">
          <div>
            <Typography.Title level={2} className="my-0 fw-500">
              Vendor Management
            </Typography.Title>
            <Typography.Title level={4} className="my-0 fw-500">
              Manage all vendors in your guide.
            </Typography.Title>
          </div>
          <Button
            className="custom-primary-btn"
            type="primary"
            size="large"
            onClick={onAddVendor}
          >
            <Flex gap="small" align="center">
              <span>Create Vendor</span>
              <HiOutlineUpload size={20} color="#fff" />
            </Flex>
          </Button>
        </Flex>
      </div>
      <CustomCard>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={vendors}
          loading={tableLoading}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </CustomCard>
      <VendorPopup
        open={visible}
        setOpen={() => setVisible(false)}
        onSaveVendor={onSaveVendor}
        vendor={selectedVendor}
        type={popupType}
        categories={categories}
      />
    </>
  );
};

export default VendorManagement;
