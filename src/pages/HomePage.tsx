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
    {key: 'Home', item: IndexContaniner, menuName: 'Home', show: true},
    {key: 'StudentManage', item: StudentManagement, menuName: 'User Manage', show: false},
    {key: 'DocumentManage', item: DocumentManage, menuName: 'DocumentManage', show: false},
];

const HomePage = () => {
    const navigate = useNavigate();


    const [currentPage, setCurrentPage] = useState(menuItems[0].key);

    const [menuItemsList, setMenuItemsList] = useState([...menuItems])


    const [userRole, setUserRole] = useState<string | null>(null); // State to store user role


    const handleItemClick = (key: string) => {

        setCurrentPage(key);
    };

    useEffect(() => {
        const role = localStorage.getItem("UserRole");

        menuItemsList.forEach(item => {
            if (!item.show) {
                if (role === 'admin' || role == 'teacher') {
                    item.show = true;
                }
            }
        })
        setMenuItemsList(menuItemsList)
        console.log('role', role)
        setUserRole(role);
    }, [menuItemsList]);


    return (
        <div>
            <div style={{display: 'inline-block', width: '90%'}}>
                <Menu mode="horizontal" theme="dark">
                    {menuItemsList.map((page) => (
                        page.show &&
                        <Menu.Item onClick={() => handleItemClick(page.key)} key={page.key} icon={<UserOutlined/>}>
                            {page.menuName}
                        </Menu.Item>
                    ))}

                </Menu>
            </div>
            <div style={{display: 'inline-block', width: '10%', lineHeight: '56px'}}>
                <ul style={{height: '46px'}}
                    className={'ul-menu ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-dark css-dev-only-do-not-override-djtmh8'}>
                    <Button onClick={() => {
                        navigate("/login")
                    }} type={'primary'} style={{marginTop: '8px', backgroundColor: '#001529'}}>logout</Button>
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
