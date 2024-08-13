import { Button, Flex, Typography, Spin, Tabs, Table } from 'antd';
import Card from '../../components/Card';
import { useEffect, useState } from 'react';
import { GET_BANK_LIST, GET_CATEGORY_GROUPS_LIST } from '../../Utils/Apis';
import { handleErrors } from '../../Utils/Utils';
import BankAccountPopup from './Banks&Accounts/BankAccountPopup';
import BankAccounts from './Banks&Accounts/BankAccounts';
import Categories from './Groups&Categories/Categories';
import CategoryGroupPopup from './Groups&Categories/CategoryGroupPopup';
import CategoryFormPopup from './Groups&Categories/CategoryFormPopup';
import NoCategories from './NoCategories';
import { bankColumns, mainColumns } from '../../Utils/TableColumns';

const Settings = () => {
  const [bankAccountPopupVisible, setBankAccountPopupVisible] = useState(false);
  const [categoryGroupPopupVisible, setCategoryGroupPopupVisible] = useState(false);
  const [categoryPopupVisible, setCategoryPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState({ bankAccount: 'ADD' });
  const [categoryPopupType, setCategoryPopupType] = useState({ group: 'ADD', category: 'ADD' });
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [expandedBankRows, setExpandedBankRows] = useState([]);
  const [expandedGroupRows, setExpandedGroupRows] = useState([]);
  const [expandKey, setExpandKey] = useState({}); // Track keys for expanded rows

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
    setGroupsLoading(true);
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
    data.forEach((item) => {
      tmp.push({
        key: item.bankID,
        ...item,
      });
    });
    setBanks(tmp);
  };

  const manageGroups = (data = []) => {
    let tmp = [];
    data.forEach((item) => {
      tmp.push({
        key: item.categoryGroupID,
        ...item,
      });
    });
    setCategoryGroups(tmp);
  };

  const openCategoryGroupPopup = (type, id = null) => {
    setCategoryPopupType((prev) => ({ ...prev, group: type }));
    setSelectedCategoryGroup(id);
    setCategoryGroupPopupVisible(true);
  };

  const openBankAccountPopup = (type, id = null) => {
    setPopupType((prev) => ({ ...prev, bankAccount: type }));
    setSelectedBankAccount(id);
    setBankAccountPopupVisible(true);
  };

  const openCategoryPopup = (type, id = null) => {
    setCategoryPopupType((prev) => ({ ...prev, category: type }));
    setSelectedCategory(id);
    setCategoryPopupVisible(true);
  };

  const expandedRowRender = (record) => {
    const key = expandKey[record.categoryGroupID] || 0;
    return (
      <Categories
        key={`categories-${record.categoryGroupID}-${key}`} // Unique key to force remount
        groupID={record.categoryGroupID}
        editCategoryClick={(categoryID) => openCategoryPopup('EDIT', categoryID)}
      />
    );
  };

  const expandedRowRenderBanks = (record) => {
    const key = expandKey[record.bankID] || 0;
    return (
      <BankAccounts
        key={`bankAccounts-${record.bankID}-${key}`} // Unique key to force remount
        bankID={record.bankID}
        editBankAccountClick={(accountID) => openBankAccountPopup('EDIT', accountID)}
      />
    );
  };

  const closeAllExpandedRows = () => {
    setExpandedBankRows([]);
    setExpandedGroupRows([]);
  };

  const handleBankTableExpand = (expanded, record) => {
    if (expanded) {
      closeAllExpandedRows(); 
      setExpandedBankRows([record.key]); 
      setExpandKey((prev) => ({
        ...prev,
        [record.bankID]: (prev[record.bankID] || 0) + 1, 
      }));
    } else {
      setExpandedBankRows([]); 
    }
  };
  
  const handleGroupTableExpand = (expanded, record) => {
    if (expanded) {
      closeAllExpandedRows(); 
      setExpandedGroupRows([record.key]); 
      setExpandKey((prev) => ({
        ...prev,
        [record.categoryGroupID]: (prev[record.categoryGroupID] || 0) + 1, 
      }));
    } else {
      setExpandedGroupRows([]); 
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="large"
        items={[
          {
            label: 'Bank Accounts',
            key: 1,
            children: (
              <Card bodyStyle={{overflowY: 'scroll'}}>
                <Flex direction={{ base: 'column', md: 'row' }}  // stack items on small screens, row on medium and up
                  justify="space-between"
                  align="center"
                  className="mb-2">
                  <Typography.Title level={3} className="fw-500">
                    Bank & Bank Accounts
                  </Typography.Title>
                  <div style={{ marginTop: '0px' }}>
                    <Button type="primary" onClick={() => openBankAccountPopup('ADD')}>
                      Add Bank Account
                    </Button>
                  </div>
                </Flex>
                {loading ? (
                  <Spin />
                ) : (
                  <Table
                    columns={bankColumns}
                    expandable={{
                      expandedRowRender: expandedRowRenderBanks,
                      expandedRowKeys: expandedBankRows,
                      onExpand: handleBankTableExpand,
                    }}
                    dataSource={banks}
                    pagination={false}
                  />
                )}
              </Card>
            ),
          },
          {
            label: 'Groups & Categories',
            key: 2,
            children: (
              <Card bodyStyle={{overflowY: 'scroll'}}>
                <Flex direction={{ base: 'column', md: 'row' }}  // stack items on small screens, row on medium and up
                  justify="space-between"
                  align="center"
                  className="mb-2">
                  <Typography.Title level={3} className="fw-500">
                    Groups & Categories
                  </Typography.Title>
                  <div style={{ marginTop: '0px' }}>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => openCategoryGroupPopup('ADD')}>
                      Add Group
                    </Button>
                    <Button type="primary" onClick={() => openCategoryPopup('ADD')}>
                      Add Category
                    </Button>
                  </div>
                </Flex>
                {categoryGroups.length === 0 ? (
                  <NoCategories addClick={() => openCategoryGroupPopup('ADD')} />
                ) : groupsLoading ? (
                  <Spin />
                ) : (
                  <Table
                    columns={mainColumns(openCategoryGroupPopup)}
                    expandable={{
                      expandedRowRender,
                      expandedRowKeys: expandedGroupRows,
                      onExpand: handleGroupTableExpand,
                    }}
                    dataSource={categoryGroups}
                    pagination={false}
                  />
                )}
              </Card>
            ),
          },
        ]}
      />
      <CategoryGroupPopup
        visible={categoryGroupPopupVisible}
        setVisible={setCategoryGroupPopupVisible}
        type={categoryPopupType.group}
        selectedGroup={selectedCategoryGroup}
        reload={callingCategoryGroupsListAPI}
      />
      <CategoryFormPopup
        visible={categoryPopupVisible}
        setVisible={setCategoryPopupVisible}
        selectedCategory={selectedCategory}
        type={categoryPopupType.category}
        reload={closeAllExpandedRows}
      />
      <BankAccountPopup
        visible={bankAccountPopupVisible}
        setVisible={setBankAccountPopupVisible}
        selectedBankAccount={selectedBankAccount}
        reload={closeAllExpandedRows}
        type={popupType.bankAccount}
      />
    </>
  );
};

export default Settings;
