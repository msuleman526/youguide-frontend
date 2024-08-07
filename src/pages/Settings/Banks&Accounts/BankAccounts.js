import { Button, List } from 'antd';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { GET_BANK_ACCOUNTS_LIST } from '../../../Utils/Apis';
import { handleErrors } from '../../../Utils/Utils';
import { themeState } from '../../../atom';

const BankAccounts = ({ bankID, editBankAccountClick }) => {
    const theme = useRecoilValue(themeState);
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        const fetchBankAccounts = async () => {
            try {
                let response = await GET_BANK_ACCOUNTS_LIST(bankID);
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
        fetchBankAccounts();
    }, []);

    return (
        <List
            style={{ margin: '5px' }}
            dataSource={bankAccounts}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button size='small' type='primary' onClick={() => editBankAccountClick(item.bankAccountID)}>Edit</Button>
                    ]}
                    style={{ borderBottom: `1px solid ${theme.iconColor}` }}
                >
                    <List.Item.Meta title={item.name} />
                </List.Item>
            )}
        />
    );
};

export default BankAccounts;
