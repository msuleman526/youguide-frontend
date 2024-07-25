import { List } from 'antd';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { GET_CATEGORIES_LIST } from '../../../Utils/Apis';
import { handleErrors } from '../../../Utils/Utils';
import { themeState } from '../../../atom';

const Categories = ({ groupID, editCategoryClick }) => {
    const theme = useRecoilValue(themeState);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                let response = await GET_CATEGORIES_LIST(groupID);
                if (response.isSuccess && response.data) {
                    const filteredCategories = response.data.filter(category => category.groupID === groupID);
                    setCategories(filteredCategories);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.log(err)
                setCategories([]);
                handleErrors('Getting Categories', err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <List
            style={{ margin: '5px' }}
            dataSource={categories}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <FiEdit size={18} color={"#b1b1b1c9"} onClick={() => editCategoryClick(item.categoryID)} />,
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

export default Categories;
