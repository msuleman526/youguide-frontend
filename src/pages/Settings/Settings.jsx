import { Button, Col, Flex, Row, Typography, Collapse, Spin } from 'antd';
import { useRecoilValue } from 'recoil';
import Card from '../../components/Card';
import { themeState } from '../../atom';
import { useEffect, useState } from 'react';
import BankFormPopup from './Banks&Accounts/BankFormPopup';
import {  GET_BANK_LIST } from '../../Utils/Apis';
import { handleErrors } from '../../Utils/Utils';
import BankAccountPopup from './Banks&Accounts/BankAccountPopup';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import BankAccounts from './Banks&Accounts/BankAccounts';

const Settings = () => {
  const theme = useRecoilValue(themeState);
  const [bankPopupVisible, setBankPopupVisible] = useState(false);
  const [bankAccountPopupVisible, setBankAccountPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState({ bank: 'ADD', bankAccount: 'ADD' });
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null)
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    callingBanksListAPI();
  }, []);

  const callingBanksListAPI = async () => {
    setLoading(true);
    try {
      let response = await GET_BANK_LIST();
      if (response.isSuccess && response.data) {
        let data = response.data;
        manageBanks(data);
      }
      setLoading(false);
    } catch (err) {
      setBanks([]);
      setLoading(false);
      handleErrors('Getting Banks', err);
    }
  };

  const manageBanks = (data = []) => {
    let tmp = [];
    data.forEach((item, index) => {
      tmp.push({
        key: item.bankID,
        label: item.name,
        children: <div>Loading...</div>,
        extra: (
          <div style={{gap: '5px', display: 'flex'}}>
            <FiEdit size={18} color={theme.iconColor} onClick={(bankID) => openBankPopup("EDIT", item.bankID)} />
            <FiTrash2 size={18} color={"red"} />
          </div>
        ),
      });
    });
    setBanks(tmp);
  };

  const openBankPopup = (type, id = null) => {
    setPopupType(prev => ({ ...prev, bank: type }));
    setSelectedBank(id);
    setBankPopupVisible(true);
  };

  const openBankAccountPopup = (type, id = null) => {
    setPopupType(prev => ({ ...prev, bankAccount: type }));
    setSelectedBankAccount(id);
    setBankAccountPopupVisible(true);
  };

  const onChangeBank = async (key) => {
    let expandedKey = key.length > 0 ? key[key.length - 1] : null; // Only keep the last expanded key
    setExpandedKeys(expandedKey ? [expandedKey] : []);

    let updatedBanks = banks.map(bank => ({
      ...bank,
      children: <div>Loading...</div> // Set all children to loading by default
    }));

    if (expandedKey) {
      let index = updatedBanks.findIndex(bank => ""+ bank.key === ""+expandedKey);
      if (index !== -1) {
        let bankID = updatedBanks[index].key;
        updatedBanks[index].children = (
          <BankAccounts bankID={bankID} editBankAccountClick={(accountID) => openBankAccountPopup("EDIT", accountID)}/>
        );
      }
    }
    setBanks(updatedBanks);
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
            {/* <Table
              size="middle"
              className="custom_table"
              bordered
              columns={groupsAndBanksColumns(theme, editBankAccountClick)}
              dataSource={groupsDataSource}
              scroll={{ x: 'max-content' }}
              pagination={false}
            /> */}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Flex justify="space-between" align="center">
              <Typography.Title level={3} className="fw-500">
                Bank & Bank Accounts
              </Typography.Title>
              <div style={{ marginTop: '-10px' }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={() => openBankPopup("ADD")}>Add Bank</Button>
                <Button type="primary" onClick={() => openBankAccountPopup("ADD")}>Add Bank Account</Button>
              </div>
            </Flex>
            {loading ? <Spin /> : <Collapse
              style={{marginTop: "10px"}}
              onChange={onChangeBank}
              activeKey={expandedKeys}
              items={banks}
            />}
          </Card>
        </Col>
      </Row>
      <BankFormPopup visible={bankPopupVisible} setVisible={setBankPopupVisible} type={popupType.bank} selectedBank={selectedBank} reload={callingBanksListAPI} />
      <BankAccountPopup visible={bankAccountPopupVisible} setVisible={setBankAccountPopupVisible} selectedBankAccount={selectedBankAccount} type={popupType.bankAccount} reload={() => onChangeBank([])} />
    </>
  );
};

export default Settings;
