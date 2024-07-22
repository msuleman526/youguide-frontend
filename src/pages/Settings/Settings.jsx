import { Button, Col, Flex, Row, Table, Typography } from 'antd';
import {
  banksDataSource,
  groupsAndBanksColumns,
  groupsDataSource,
} from '../../components/transaction/TransactionData';
import { useRecoilValue } from 'recoil';
import Card from '../../components/Card';
import { themeState } from '../../atom';
import { useState } from 'react';
import BankFormPopup from './BankFormPopup';

const Settings = () => {
  const theme = useRecoilValue(themeState);
  const columns = groupsAndBanksColumns(theme);
  const [bankPopupVisible, setBankPopupVisible] = useState(false)
  const [bankPopupType, setBankPopupType] = useState("ADD")
  

  const addBankBtnClick = (type) => {
    setBankPopupVisible(true)
    setBankPopupType("ADD")
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Flex justify="space-between" align="center">
              <Typography.Title level={3} className="fw-500">
                Groups & Categories
              </Typography.Title>
              <div style={{marginTop: '-10px'}}>
                <Button type="primary" style={{ marginRight: 8 }}>Add Category</Button>
                <Button type="primary">Add Group</Button>
              </div>
            </Flex>
            <Table
              size="middle"
              className="custom_table"
              bordered
              columns={columns}
              dataSource={groupsDataSource}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Flex justify="space-between" align="center">
              <Typography.Title level={3} className="fw-500">
                Bank & Bank Accounts
              </Typography.Title>
              <div style={{marginTop: '-10px'}}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={addBankBtnClick}>Add Bank</Button>
                <Button type="primary">Add Bank Account</Button>
              </div>
            </Flex>
            <Table
              size="middle"
              className="custom_table"
              bordered
              columns={columns}
              dataSource={banksDataSource}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <BankFormPopup visible={bankPopupVisible} setVisible={setBankPopupVisible} type={bankPopupType} />
    </>
  );
};

export default Settings;
