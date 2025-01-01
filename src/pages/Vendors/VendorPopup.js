import { Modal, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';

const VendorPopup = ({ open, setOpen, onSaveVendor, vendor, type, categories }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")

  useEffect(() => {
    if (vendor) {
      form.setFieldsValue({
        ...vendor,
        subscriptionEndDate: vendor.subscriptionEndDate
          ? moment(vendor.subscriptionEndDate, 'YYYY-MM-DD') // Ensure format matches
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [vendor, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
        setLoading(true)
        values['subscriptionEndDate'] = date
        console.log(values)
        ApiService.saveVendorSubsubscription(values).then((res) => {
            setLoading(false)
            onSaveVendor(res);
        }).catch((err) => {
            setLoading(false)
            console.log(err)
        })
    });
  };

  const onDateChage = (val) => {
    setDate(val.format("YYYY-MM-DD"))
  }

  return (
    <Modal
      title={`${type} Vendor Subsciption`}
      visible={open}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => setOpen(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Vendor Name"
          name="name"
          rules={[{ required: true, message: 'Vendor name is required' }]}
        >
          <Input style={{width: '100%'}}/>
        </Form.Item>
        <Form.Item
          label="Subscription End Date"
          name="subscriptionEndDate"
          rules={[{ required: true, message: 'Subscription end date is required' }]}
        >
          <DatePicker style={{width: '100%'}} onChange={onDateChage} format={"YYYY-MM-DD"} />
        </Form.Item>
        <Form.Item
          label="No Of Clicks"
          name="numberOfClicks"
          rules={[{ required: true, message: 'Number of clicks is required' }]}
        >
          <InputNumber min={0} style={{width: '100%'}}/>
        </Form.Item>
        <Form.Item
          label="Categories"
          name="categories"
          rules={[{ required: true, message: 'Please select at least one category' }]}
        >
          <Select mode="multiple" style={{width: '100%'}} options={categories.map((c) => ({ label: c.name, value: c._id }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VendorPopup;
