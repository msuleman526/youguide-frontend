import React, { useEffect, useState } from 'react';
import { Button, Flex, Select, Table, Typography, Modal, Tag, Form, Input, message, Image } from 'antd';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import BookPopup from './BookPopup';
import UploadFormPopup from './UploadFormPopup';
import ApiService from '../../APIServices/ApiService';
import { Link } from 'react-router-dom';

const Books = () => {
  const theme = useRecoilValue(themeState);
  const [uploadVisible, setUploadVisible] = useState(false)
  const [books, setBooks] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedBookStatus, setSelectedBookStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setTableLoading(true)
    ApiService.getAllBooks().then((response) => {
        setBooks(response)
        setTableLoading(false)
    }).catch(error => {
        setTableLoading(false)
        message.error(error?.response?.data?.message || "Books Failed.")
        setBooks([])
    });
}, [])


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
      title: '#',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (imagePath) => <Image src={"http://localhost:5000/" + imagePath} style={{width: '80px', borderRadius: '10px'}}/>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color='blue'>{category.name}</Tag>
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
        <Tag color={status ? 'green' : 'volcano'}>{status ? "Active" : "Not Active"}</Tag>
      ),
    },
    {
      title: 'Open Books',
      dataIndex: 'openBooks',
      key: 'openBooks',
      render: (openBooks) => <div className='book-badge'>{openBooks ||"0"}</div>,
    },
    {
      title: 'Offline Books',
      key: 'offlineBooks',
      dataIndex: 'offlineBooks',
      render: (offlineBooks) => <div className='book-badge'>{offlineBooks ||"0"}</div>,
    },
    {
      title: 'Download Books',
      key: 'downloadBooks',
      dataIndex: 'downloadBooks',
      render: (downloadBooks) => <div className='book-badge'>{downloadBooks ||"0"}</div>,
    },
    {
      title: 'Langauges',
      dataIndex: 'languages',
      key: 'languages',
      render: (languages) => <div>{languages.join(', ')}</div>,
    },
    {
      title: 'Documents',
      dataIndex: 'filePath',
      key: 'filePath',
      render: (index, record) => <Button size='small'><Link to={"http://localhost:5000/" + record.filePath+"?id="+user.id} target="_blank">PDF</Link></Button>,
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
                <Select.Option key="Active" value={true}>Active</Select.Option>
                <Select.Option key="Not Active" value={false}>Not Active</Select.Option>
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
