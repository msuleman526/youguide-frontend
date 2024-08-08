import { Button, Tag } from "antd";

export const mainColumns = (openCategoryGroupPopup) => {
    return [
        {
            title: 'DISPLAY NAME',
            width: '25%',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'DESCRIPTION',
            dataIndex: 'description',
            width: '40%',
            key: 'description',
        },
        {
            title: 'TREAT AS ACTIVE',
            dataIndex: 'isActive',
            width: '12.5%',
            key: 'isActive',
            render: (text, record) => (<Tag color={record.isActive ? 'green' : 'red'}>{record.isActive ? "Active" : 'Not Active'}</Tag>),
        },
        {
            title: 'TREAT AS TRACKED',
            dataIndex: 'isTracked',
            width: '12.5%',
            key: 'isTracked',
            render: (text, record) => (<Tag color={record.isTracked ? 'green' : 'red'}>{record.isTracked ? "Tracked" : 'Not Tracked'}</Tag>),
        },
        {
            title: 'ACTIONS',
            dataIndex: 'action',
            width: '10%',
            key: 'action',
            render: (text, item) => (
                <Button size='small' type='primary' onClick={() => openCategoryGroupPopup("EDIT", item.categoryGroupID)}>Edit</Button>
            ),
        },
    ];
}

export const bankColumns = [
    {
        title: 'DISPLAY NAME',
        width: '70%',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'TREAT AS ACTIVE',
        dataIndex: 'isActive',
        width: '15%',
        key: 'isActive',
        render: (text, record) => (<Tag color={record.isActive ? 'green' : 'red'}>{record.isActive ? "Active" : 'Not Active'}</Tag>),
    },
    {
        title: 'TREAT AS TRACKED',
        dataIndex: 'isTracked',
        width: '15%',
        key: 'isTracked',
        render: (text, record) => (<Tag color={record.isTracked ? 'green' : 'red'}>{record.isTracked ? "Tracked" : 'Not Tracked'}</Tag>),
    },
];