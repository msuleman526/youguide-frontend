import React, { useState } from 'react';
import { Button, Flex, Select, Table, Typography, Modal, Tag, Form, Input } from 'antd';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import BookPopup from './BookPopup';
import UploadFormPopup from './UploadFormPopup';

const Books = () => {
  const theme = useRecoilValue(themeState);
  const [uploadVisible, setUploadVisible] = useState(false)
  const [books, setBooks] = useState([
    {
      id: 1,
      name: 'The complete travel guide for Afghanistan',
      address: 'Kabul Afghanistan',
      status: 'Active',
      openBooks: 15,
      offlineBooks: 5,
      downloadBooks: 2,
      created_at: '2024-01-01',
      language: 'English, Phasto',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'The complete travel guide for Alabama',
      address: 'Montgomery, Albama',
      status: 'Active',
      openBooks: 20,
      offlineBooks: 7,
      downloadBooks: 5,
      created_at: '2024-02-01',
      language: 'English',
      rating: 4.5,
    },
  ]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedBookStatus, setSelectedBookStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const deleteBook = (bookId) => {
    setTableLoading(true);
    try {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (err) {
      console.error('Deleting Book', err);
    } finally {
      setTableLoading(false);
    }
  };

  const confirmDelete = (bookId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this book?',
      onOk: () => deleteBook(bookId),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const handleAddBook = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newBook = {
          ...values,
          id: books.length + 1, // Simple ID assignment
          created_at: new Date().toISOString().split('T')[0], // Current date
        };
        setBooks([...books, newBook]);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
 };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'volcano'}>{status}</Tag>
      ),
    },
    {
      title: 'Open Books',
      dataIndex: 'openBooks',
      key: 'openBooks',
      render: (openBooks) => <div className='book-badge'>{openBooks}</div>,
    },
    {
      title: 'Offline Books',
      key: 'offlineBooks',
      dataIndex: 'offlineBooks',
      render: (offlineBooks) => <div className='book-badge'>{offlineBooks}</div>,
    },
    {
      title: 'Download Books',
      key: 'downloadBooks',
      dataIndex: 'downloadBooks',
      render: (downloadBooks) => <div className='book-badge'>{downloadBooks}</div>,
    },
    {
      title: 'Langauge',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <div className='book-badge'>{rating}</div>,
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
        <Flex>
          <Button type="link" onClick={() => console.log('Edit functionality here')}>
            <FaEdit />
          </Button>
          <Button type="link" danger onClick={() => confirmDelete(record.id)}>
            <FaTrashAlt />
          </Button>
        </Flex>
      ),
    },
  ];

  // Filter books based on selected status
  const filteredBooks = selectedBookStatus === 'all'
    ? books
    : books.filter(book => book.status === selectedBookStatus);

  return (
    <>
      <div>
        <Flex justify="space-between" align="center" className="mb-2">
          <div>
            <Typography.Title level={2} className="my-0 fw-500">
              Travel Guide Books Management
            </Typography.Title>
            <Typography.Title level={4} className="my-0 fw-500">
              Manage all travel guide books in the library
            </Typography.Title>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Flex justify="end" align="center" gap="small" className="mb-2">
              <Select
                defaultValue="all"
                style={{ width: '250px' }}
                className={theme === 'light' ? 'header-search-input-light' : 'header-search-input-dark'}
                onChange={value => setSelectedBookStatus(value)}
              >
                <Select.Option key="all" value="all">All Statuses</Select.Option>
                <Select.Option key="Active" value="Active">Active</Select.Option>
                <Select.Option key="Not Active" value="Not Active">Not Active</Select.Option>
              </Select>
            </Flex>
            <Button
              className="custom-primary-btn"
              type="primary"
              size="large"
              onClick={() => setUploadVisible(true)}
            >
              <Flex gap="small" align="center">
                <span>Upload Books</span>
              </Flex>
            </Button>
            <Button
              className="custom-primary-btn"
              type="primary"
              size="large"
              onClick={handleAddBook}
            >
              <Flex gap="small" align="center">
                <span>Add Book</span>
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
          dataSource={filteredBooks}
          loading={tableLoading}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </CustomCard>
      <UploadFormPopup visible={uploadVisible} setVisible={() => setUploadVisible(false)} />
      <BookPopup visible={isModalVisible} onClose={handleCancel} onAddBook={handleAddBook} />
    </>
  );
};

export default Books;
