import React, {CSSProperties, useEffect, useState} from 'react';
import {Menu, Button} from 'antd';
import {IndexContaniner} from '../component/indexContaniner';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import StudentManagement from "../component/StudentManagement";
import {getMenuList} from "../api/menu";
import {JSX} from 'react/jsx-runtime';
import {MenuManage} from "../component/MenuManage";
import DocumentManage from "../component/DocumentManage";
import {useNavigate} from "react-router-dom";

const initialCustomStyle: CSSProperties = {
    color: 'blue',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.8s ease-in-out'
};

// Setting menu
const menuItems = [
    {key: 'Home', item: IndexContaniner, menuName: 'Home', show: false},
    {key: 'StudentManage', item: StudentManagement, menuName: 'StudentManage', show: false},
    {key: 'DocumentManage', item: DocumentManage, menuName: 'DocumentManage', show: false},
    // {key: 'MenuManage', item: MenuManage, menuName: 'MenuManage', show: false}
];

const HomePage = () => {
    const navigate = useNavigate();


    const [currentPage, setCurrentPage] = useState(menuItems[0].key);

    const [menuItemsList, setMenuItemsList] = useState([...menuItems])

    const handleItemClick = (key: string) => {
        setCurrentPage(key);
    };

    const handleLogout = () => {
        // Implement logout logic here
        console.log("User logged out");
    };

    return (
        <div>
            <div style={{display: 'inline-block', width: '90%'}}>
                <Menu mode="horizontal" theme="dark">
                    {menuItemsList.map((page) => (
                        <Menu.Item onClick={() => handleItemClick(page.key)} key={page.key} icon={<UserOutlined/>}>
                            {page.menuName}
                        </Menu.Item>
                    ))}
                </Menu>
            </div>
            <div style={{display: 'inline-block', width: '10%', lineHeight: '56px'}}>
                <ul  style={{height: '46px'}}
                    className={'ul-menu ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-dark css-dev-only-do-not-override-djtmh8'}>
                    <Button onClick={()=>{
                        navigate("/login")
                    }} type={'primary'} style={{marginTop: '8px'}}>logout</Button>
                </ul>
            </div>
            {menuItemsList.map((page) => (
                <div key={page.key} style={{...initialCustomStyle, opacity: currentPage === page.key ? 1 : 0}}>
                    {currentPage === page.key && <page.item/>}
                </div>
            ))}
        </div>
    );
};

export default HomePage;
