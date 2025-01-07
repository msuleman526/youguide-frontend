import { Button, Flex, Table, Typography, Modal, Tag, message } from 'antd'
import { HiOutlineUpload } from 'react-icons/hi'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import { useEffect, useState } from 'react'
import ApiService from '../../APIServices/ApiService'
import CategoryPopup from './CategoriesPopup'

const Categories = () => {
  const theme = useRecoilValue(themeState)
  const [categories, setCategories] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [popupType, setPopupType] = useState("Add")

  useEffect(() => {
      setTableLoading(true)
      ApiService.getAllCategories().then((response) => {
          setCategories(response)
          setTableLoading(false)
      }).catch(error => {
          setTableLoading(false)
          message.error(error?.response?.data?.message || "Categories Failed.")
          setCategories([])
      });
  }, [])

  const deleteRole = async (categoryID) => {
    setTableLoading(true)
    try {
      await ApiService.deleteCategory(categoryID)
      message.success('Category deleted successfully.')
      setCategories(prevCategories => prevCategories.filter(category => category._id !== categoryID))
    } catch (err) {
    } finally {
      setTableLoading(false)
    }
  }

  const confirmDelete = (categoryId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      onOk: () => deleteRole(categoryId),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_, record) => (
         new Date(record.created_at).toLocaleString()
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => handleEdit(record)}>
            <FaEdit />=
          </Button>
          {/* <Button type="link" danger onClick={() => confirmDelete(record._id)}>
            <FaTrashAlt />
          </Button> */}
        </Flex>
      ),
    },
  ];

  const handleEdit = (category) => {
      setSelectedCategory(category)
      setPopupType("Edit")
      setVisible(true)
  }

  const onAddCategory = () => {
    setPopupType("Add")
    setVisible(true)
  }

  const onSaveCategory= (category) => {
    if (popupType === "Edit") {
      setCategories(prevCategories => prevCategories.map(r => {
        if (r._id === category._id) {
          return category
        }
        return r
      }))
    }else{
      setCategories(prevCategories => [...prevCategories, category])
    }
    setVisible(false)
  }

  return (
    <>
    <div>
      <Flex justify="space-between" align="center" className="mb-2">
        <div>
          <Typography.Title level={2} className="my-0 fw-500">
            Category Management
          </Typography.Title>
          <Typography.Title level={4} className="my-0 fw-500">
            Manage all categories in you guide.
          </Typography.Title>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <Button
            className="custom-primary-btn"
            type="primary"
            size="large"
            onClick={onAddCategory}
          >
            <Flex gap="small" align="center">
              <span>Create Category</span>
              <HiOutlineUpload size={20} color="#fff" />
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
        dataSource={categories}
        loading={tableLoading}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </CustomCard>
    <CategoryPopup open={visible} setOpen={() => setVisible(false)} onSaveCategory={onSaveCategory} category={selectedCategory} type={popupType} />
    </>
  )
}

export default Categories
