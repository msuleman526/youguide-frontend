import { Button, Col, Flex, Row, Table, Typography, List } from 'antd';
import { banksDataSource, groupsAndBanksColumns, groupsDataSource } from '../../components/transaction/TransactionData';
import { useRecoilValue } from 'recoil';
import Card from '../../components/Card';
import { themeState } from '../../atom';
import { useEffect, useState } from 'react';
import BankFormPopup from './BankFormPopup';
import { GET_BANK_ACCOUNTS_LIST, GET_BANK_LIST } from '../../Utils/Apis';
import { handleErrors } from '../../Utils/Utils';
import BankAccountPopup from './BankAccountPopup';
import { FiDelete, FiEdit, FiTrash2 } from 'react-icons/fi';

const Settings = () => {
  const theme = useRecoilValue(themeState);
  const [bankPopupVisible, setBankPopupVisible] = useState(false);
  const [bankAccountPopupVisible, setBankAccountPopupVisible] = useState(false);
  const [bankPopupType, setBankPopupType] = useState('ADD');
  const [bankAccountPopupType, setBankAccountPopupType] = useState('ADD');
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    callingBanksListAPI();
    callingBanksAccountsListAPI();
  }, []);

  const callingBanksListAPI = async () => {
    setLoading(true);
    try {
      let response = await GET_BANK_LIST();
      if (response.isSuccess && response.data) {
        setBanks(response.data);
      } else {
        setBanks([]);
      }
      setLoading(false);
    } catch (err) {
      setBanks([]);
      setLoading(false);
      handleErrors('Getting Banks', err);
    }
  };

  const callingBanksAccountsListAPI = async () => {
    try {
      let response = await GET_BANK_ACCOUNTS_LIST();
      if (response.isSuccess && response.data) {
        setBankAccounts(response.data);
      } else {
        setBankAccounts([]);
      }
    } catch (err) {
      setBankAccounts([]);
      handleErrors('Getting Banks', err);
    }
  };

  const addBankBtnClick = () => {
    setBankPopupVisible(true);
    setBankPopupType('ADD');
  };

  const addBankAccountBtnClick = () => {
    setBankAccountPopupVisible(true);
    setBankAccountPopupType('ADD');
  };

  const editBankAccountClick = (id) => {
    setSelectedBank(id);
    setBankPopupType('EDIT');
    setBankPopupVisible(true);
  };

  const reloadBanksLists = () => {
    callingBanksListAPI();
    callingBanksAccountsListAPI();
  };

  const expandedRowRender = (record) => {
    const filteredAccounts = bankAccounts.filter(account => account.bankId === record.id);
    let iconColor = theme === 'light' ? '#A8AAAD' : '#D2D4D8';
    return (
      <List
        style={{ margin: '5px' }}
        dataSource={filteredAccounts}
        renderItem={(item) => (
          <List.Item
            actions={[
              <FiEdit size={18} color={iconColor} onClick={() => editBankAccountClick(item.id)} />,
              <FiTrash2 size={18} color={iconColor} />
            ]}
            style={{ borderBottom: `1px solid ${iconColor}` }}
          >
            <List.Item.Meta
              title={item.name}
            />
          </List.Item>
        )}
      />
    );
  };

  const onExpand = (expanded, record) => {
    setExpandedRowKeys(expanded ? [record.id] : []);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Flex justify="space-between" align="center">
              <Typography.Title level={3} className="fw-500">
                Groups & Categories
              </Typography.Title>
              <div style={{ marginTop: '-10px' }}>
                <Button type="primary" style={{ marginRight: 8 }}>Add Category</Button>
                <Button type="primary">Add Group</Button>
              </div>
            </Flex>
            <Table
              size="middle"
              className="custom_table"
              bordered
              columns={groupsAndBanksColumns(theme, editBankAccountClick)}
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
              <div style={{ marginTop: '-10px' }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={addBankBtnClick}>Add Bank</Button>
                <Button type="primary" onClick={addBankAccountBtnClick}>Add Bank Account</Button>
              </div>
            </Flex>
            <Table
              loading={loading}
              size="middle"
              className="custom_table"
              bordered
              columns={groupsAndBanksColumns(theme, editBankAccountClick)}
              dataSource={banks}
              expandable={{
                expandedRowRender,
                onExpand,
                expandedRowKeys,
              }}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <BankFormPopup visible={bankPopupVisible} setVisible={setBankPopupVisible} type={bankPopupType} selectedBank={selectedBank} reload={reloadBanksLists} />
      <BankAccountPopup visible={bankAccountPopupVisible} setVisible={setBankAccountPopupVisible} type={bankAccountPopupType} />
    </>
  );
};

export default Settings;
