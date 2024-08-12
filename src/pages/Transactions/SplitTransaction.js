import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Form, Flex, Typography, Alert, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import CustomCard from '../../components/Card';
import { useRecoilState } from 'recoil';
import { themeState } from '../../atom';
import CustomInput from '../../components/Input';
import { convertDateToDateTime, convertDateToNormal } from '../../Utils/Utils';

const { Option } = Select;

const SplitTransaction = ({ open, setOpen, categories, transaction }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [theme, setTheme] = useRecoilState(themeState);
    const [splitSum, setSplitSum] = useState(0);


    useEffect(() => {
        form.setFieldsValue({
            fields: [{ description: '', amount: "", category: '' }]
        });
    }, [form]);

    const closeDrawer = () => {
        setOpen(false);
    };

    const onFinish = (values) => {
        console.log('Form values:', values);
        const sum = values.fields.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
        setSplitSum(sum);
    };

    const onFieldsChange = (changedFields, allFields) => {
        const fields = form.getFieldValue('fields') || [];
        const sum = fields.reduce((acc, item) => {
            const amount = item?.amount ? parseFloat(item.amount) : 0;
            return acc + amount;
        }, 0);
        setSplitSum(transaction?.amount - sum);
    };

    return (
        <Drawer
            title={<Typography level={3} className="fw-500">{"Split Account Transaction"}</Typography>}
            width={500}
            onClose={closeDrawer}
            open={open}
            closeIcon={null}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Typography.Title level={4}>Total Split Sum: ${splitSum}</Typography.Title>
                    <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={onFinish} type="primary" loading={loading}>
                        Submit Splits
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                style={{ marginBottom: '10px' }}
                message="Divide your transaction amount into separate transactions, e.g., paying for lunch and splitting it among friends."
                type="info"
            />

            <Divider />
            <Flex justify="space-between">
                <Typography.Text>{transaction?.description}</Typography.Text>
                <Typography.Text>{transaction?.transactionDate.split("T")[0]}</Typography.Text>
                <Typography.Text>{transaction?.amount}$</Typography.Text>
            </Flex>
            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFieldsChange={onFieldsChange}
            >
                <Form.List name="fields">
                    {(fields, { add, remove }) => (
                        <CustomCard bodyStyle={{ padding: '12px' }}>
                            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                <Flex key={key} justify='space-between' style={{ gap: '5px' }}>
                                    <Form.Item
                                        {...restField}
                                        label={index === 0 ? "Description" : ""}
                                        style={{ width: '50%' }}
                                        name={[name, 'description']}
                                        rules={[{ required: true, message: 'Missing description' }]}
                                    >
                                        <CustomInput placeholder="e.g. John's share" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        label={index === 0 ? "Amount" : ""}
                                        name={[name, 'amount']}
                                        style={{ width: '18%' }}
                                        rules={[{ required: true, message: 'Missing amount' }]}
                                    >
                                        <CustomInput placeholder="10" type="number" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        label={index === 0 ? "Category" : ""}
                                        name={[name, 'category']}
                                        style={{ width: '32%' }}
                                        rules={[{ required: true, message: 'Missing category' }]}
                                    >
                                        <Select
                                            bodyStyle={{ maxHeight: '32px' }}
                                            placeholder={"e.g. Food"}
                                            className={
                                                theme === 'light'
                                                    ? 'header-search-input-light'
                                                    : 'header-search-input-dark'
                                            }
                                        >
                                            {categories.map(category => (
                                                <Select.Option key={category.categoryID} value={category.categoryID}>
                                                    {category.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Flex>
                            ))}
                            <Button
                                style={{ marginTop: '5px' }}
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add More
                            </Button>
                        </CustomCard>
                    )}
                </Form.List>
            </Form>
        </Drawer>
    );
};

export default SplitTransaction;
