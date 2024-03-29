import React, {CSSProperties, useState} from 'react';
import {Menu} from 'antd';
import {CardBox} from '../component/CardBox';
import {UserOutlined} from '@ant-design/icons';
import {DocumentManage} from "../component/DocumentManage";
import StudentManagement from "../component/StudentManagement";

const initialCustomStyle: CSSProperties = {
    color: 'blue',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.8s ease-in-out'
};

const menuItems = [
    {key: 'Home', item: CardBox, menuName: 'Home'},
    {key: 'StudentManage', item: StudentManagement, menuName: 'StudentManage'},
    {key: 'DocumentManage', item: DocumentManage, menuName: 'DocumentManage'}
];

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(menuItems[0].key);

    const handleItemClick = (key: string) => {
        setCurrentPage(key);
    };

    return (
        <div>
            <Menu mode="horizontal" theme="dark" style={{textAlign: 'right'}}>
                {menuItems.map((page) => (
                    <Menu.Item onClick={() => handleItemClick(page.key)} key={page.key} icon={<UserOutlined/>}>
                        {page.menuName}
                    </Menu.Item>
                ))}
            </Menu>
            {menuItems.map((page) => (
                <div key={page.key} style={{...initialCustomStyle, opacity: currentPage === page.key ? 1 : 0}}>
                    {currentPage === page.key && <page.item/>}
                </div>
            ))}
        </div>
    );
};

export default HomePage;
