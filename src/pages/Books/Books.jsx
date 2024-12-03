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
  const [uploadVisible, setUploadVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedBookStatus, setSelectedBookStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all'); // New state for selected category
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 3,
  });
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Fetch all books
    fetchAllBooks(pagination.current);

    // Fetch all categories
    ApiService.getAllCategories()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        message.error("Failed to load categories.");
      });
  }, []);

  const deleteBook = async (bookId) => {
    setTableLoading(true);
    try {
      await ApiService.deleteBook(bookId);
      message.success('Book deleted successfully.');
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      setTableLoading(false);
    } catch (err) {
      message.error("There is some issue while deleting.");
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

  const onAddBook = (book) => {
    message.success("Book added successfully.");
    setBooks((prevBooks) => [...prevBooks, book]);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newBook = {
          ...values,
          id: books.length + 1,
          created_at: new Date().toISOString().split('T')[0],
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
      title: 'Documents',
      dataIndex: 'pdfFiles',
      key: 'pdfFiles',
      render: (index, record) => <div style={{width: '190px'}}>{
        record.pdfFiles.map((file, index) => (
          <Tag color='volcano' style={{margin: '2px'}} onClick={() => window.open("http://localhost:5000/" + file.filePath, "_blank")}>{file.language}</Tag>
        ))  
      }</div>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => console.log('Edit functionality here')}>
            <FaEdit />
          </Button>
          <Button type="link" danger onClick={() => confirmDelete(record._id)}>
            <FaTrashAlt />
          </Button>
        </Flex>
      ),
    },
  ];


  const fetchAllBooks = (page, q) => {
    setTableLoading(true);
    ApiService.getAllBooks(page, language, q)
      .then((response) => {
        let obj = {
          ...pagination,
          current: response.currentPage,
          total: response.totalBooks, // Replace 'total' with the total count of items
        }
        setPagination(obj);
        setTableLoading(false);
        setBooks(response.books);
      })
      .catch((error) => {
        setTableLoading(false);
        message.error(error?.response?.data?.message || "Books Failed.");
        setBooks([]);
      });
  }

  // Filter books based on selected status and category
  const filteredBooks = books.filter((book) => {
    return (
      (selectedBookStatus === 'all' || book.status === selectedBookStatus) &&
      (selectedCategory === 'all' || book.category._id === selectedCategory)
    );
  });

  const onTableChange = (vale) => {
      setPagination(vale)
      fetchAllBooks(vale.current, query)
  }

  const onPressEnter = (e) => {
      setQuery(...e.target.value)
      fetchAllBooks(1, e.target.value)
  }

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
            {/* <Select
              defaultValue="all"
              style={{ width: '250px' }}
              onChange={(value) => setSelectedBookStatus(value)}
              className={theme === 'light' ? 'header-search-input-light' : 'header-search-input-dark'}
            >
              <Select.Option value="all">All Statuses</Select.Option>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Not Active</Select.Option>
            </Select> */}
            <Select
              defaultValue="all"
              style={{ width: '250px' }}
              onChange={(value) => setSelectedCategory(value)}
              className={theme === 'light' ? 'header-search-input-light' : 'header-search-input-dark'}
            >
              <Select.Option value="all">All Categories</Select.Option>
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
            <Input placeholder='Search by name or city or country' onPressEnter={onPressEnter}/>
            <Button
              className="custom-primary-btn"
              type="primary"
              size="large"
              onClick={() => setUploadVisible(true)}
            >
              <span>Upload Books</span>
            </Button>
            <Button
              className="custom-primary-btn"
              type="primary"
              size="large"
              onClick={handleAddBook}
            >
              <span>Add Book</span>
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
          pagination={pagination}
          onChange={onTableChange}
          scroll={{ x: 'max-content' }}
        />
      </CustomCard>
      <UploadFormPopup visible={uploadVisible} setVisible={() => setUploadVisible(false)} fetchAllBooks={() => fetchAllBooks(pagination.current, query)} />
      <BookPopup visible={isModalVisible} onClose={handleCancel} onAddBook={onAddBook} />
    </>
  );
};

export default Books;
