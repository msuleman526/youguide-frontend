import { List } from 'antd';
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
                        <FiEdit size={18} color={"#b1b1b1c9"} onClick={() => editBankAccountClick(item.bankAccountID)} />,
                        <FiTrash2 size={18} color={"red"} />
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
