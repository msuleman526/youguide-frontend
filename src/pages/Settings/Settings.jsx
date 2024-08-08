import { Button, Col, Flex, Row, Typography, Collapse, Spin, Tabs, Tag } from 'antd';
import { useRecoilValue } from 'recoil';
import Card from '../../components/Card';
import { themeState } from '../../atom';
import { useEffect, useState } from 'react';
import BankFormPopup from './Banks&Accounts/BankFormPopup';
import {  GET_BANK_LIST, GET_CATEGORY_GROUPS_LIST } from '../../Utils/Apis';
import { handleErrors } from '../../Utils/Utils';
import BankAccountPopup from './Banks&Accounts/BankAccountPopup';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import BankAccounts from './Banks&Accounts/BankAccounts';
import Categories from './Groups&Categories/Categories';
import CategoryGroupPopup from './Groups&Categories/CategoryGroupPopup';
import CategoryFormPopup from './Groups&Categories/CategoryFormPopup';
import NoCategories from './NoCategories';

const Settings = () => {
  const [bankAccountPopupVisible, setBankAccountPopupVisible] = useState(false);
  const [categoryGroupPopupVisible, setCategoryGroupPopupVisible] = useState(false);
  const [categoryPopupVisible, setCategoryPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState({ bankAccount: 'ADD' });
  const [categoryPopupType, setCategoryPopupType] = useState({ group: 'ADD', category: 'ADD' });
  const [selectedBankAccount, setSelectedBankAccount] = useState(null)
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [cExpandedKeys, setCExpandedKeys] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false)

  useEffect(() => {
    callingBanksListAPI();
    callingCategoryGroupsListAPI();
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

  const callingCategoryGroupsListAPI = async () => {
    setGroupsLoading(true)
    try {
      let response = await GET_CATEGORY_GROUPS_LIST();
      if (response.isSuccess && response.data) {
        let data = response.data;
        manageGroups(data);
      }
      setGroupsLoading(false);
    } catch (err) {
      setCategoryGroups([]);
      setGroupsLoading(false);
      handleErrors('Getting Groups', err);
    }
  };

  const manageBanks = (data = []) => {
    let tmp = [];
    data.forEach((item, index) => {
      tmp.push({
        key: item.bankID,
        label: item.name,
        children: <div>Loading...</div>,
        extra: "",
      });
    });
    setBanks(tmp);
  };

  const manageGroups = (data = []) => {
    let tmp = [];
    data.forEach((item, index) => {
      tmp.push({
        key: item.categoryGroupID,
        label: item.name,
        children: <div>Loading...</div>,
        extra: (
          <div style={{gap: '5px', display: 'flex'}}>
            <Tag color={(item.isTracked) ? 'green' : 'red'}>{(item.isTracked) ? 'Tracked' : 'Not Tracked'}</Tag>
            <Tag color={(item.isActive) ? 'green' : 'red'}>{(item.isActive) ? 'Active' : 'Not Active'}</Tag>
            <Button size='small' type='primary' onClick={() => openCategoryGroupPopup("EDIT", item.categoryGroupID)}>Edit</Button>
          </div>
        ),
      });
    });
    setCategoryGroups(tmp);
  };

  const openCategoryGroupPopup = (type, id = null) => {
    setCategoryPopupType(prev => ({ ...prev, group: type }));
    setSelectedCategoryGroup(id);
    setCategoryGroupPopupVisible(true);
  };

  const openBankAccountPopup = (type, id = null) => {
    setPopupType(prev => ({ ...prev, bankAccount: type }));
    setSelectedBankAccount(id);
    setBankAccountPopupVisible(true);
  };

  const openCategoryPopup = (type, id = null) => {
    setCategoryPopupType(prev => ({ ...prev, category: type }));
    setSelectedCategory(id);
    setCategoryPopupVisible(true);
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

  const onChangeGroups = async (key) => {
    let expandedKey = key.length > 0 ? key[key.length - 1] : null;
    setCExpandedKeys(expandedKey ? [expandedKey] : []);

    let updatedGroups = categoryGroups.map(group => ({
      ...group,
      children: <div>Loading...</div>
    }));

    if (expandedKey) {
      let index = updatedGroups.findIndex(group => ""+ group.key === ""+expandedKey);
      if (index !== -1) {
        let bankID = updatedGroups[index].key;
        console.log(bankID)
        updatedGroups[index].children = (
          <Categories groupID={bankID} editCategoryClick={(categoryID) => openCategoryPopup("EDIT", categoryID)}/>
        );
      }
    }
    setCategoryGroups(updatedGroups);
  };

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={"large"}
        items={[
          {
            label: `Bank Accounts`,
            key: 1,
            children: <Card>
              <Flex justify="space-between" align="center">
                <Typography.Title level={3} className="fw-500">
                  Bank & Bank Accounts
                </Typography.Title>
                <div style={{ marginTop: '-10px' }}>
                  <Button type="primary" onClick={() => openBankAccountPopup("ADD")}>Add Bank Account</Button>
                </div>
              </Flex>
              {loading ? <Spin /> : <Collapse
                style={{marginTop: "10px"}}
                onChange={onChangeBank}
                activeKey={expandedKeys}
                items={banks}
              />}
            </Card>,
          },
          {
            label: `Groups & Categories`,
            key: 2,
            children: <Card>
              <Flex justify="space-between" align="center">
                <Typography.Title level={3} className="fw-500">
                  Groups & Categories
                </Typography.Title>
                <div style={{ marginTop: '-10px' }}>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => openCategoryGroupPopup("ADD")}>Add Group</Button>
                  <Button type="primary" onClick={() => openCategoryPopup("ADD")}>Add Category</Button>
                </div>
              </Flex>
              {categoryGroups.length == 0 ? <NoCategories addClick={() => openCategoryGroupPopup("ADD")}/> : 
              groupsLoading ? <Spin /> : <Collapse
                style={{marginTop: "10px"}}
                onChange={onChangeGroups}
                activeKey={cExpandedKeys}
                items={categoryGroups}
              />}
            </Card>,
          }
        ]}
      />
      <CategoryGroupPopup visible={categoryGroupPopupVisible} setVisible={setCategoryGroupPopupVisible} type={categoryPopupType.group} selectedGroup={selectedCategoryGroup} reload={callingCategoryGroupsListAPI} />
      <CategoryFormPopup visible={categoryPopupVisible} setVisible={setCategoryPopupVisible} selectedCategory={selectedCategory} type={categoryPopupType.category} reload={() => onChangeGroups([])} />
      <BankAccountPopup visible={bankAccountPopupVisible} setVisible={setBankAccountPopupVisible} selectedBankAccount={selectedBankAccount} type={popupType.bankAccount} reload={() => onChangeBank([])} />
    </>
  );
};

export default Settings;
