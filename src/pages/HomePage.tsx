import React, {CSSProperties, useEffect, useState} from 'react';
import {Menu} from 'antd';
import {CardBox} from '../component/CardBox';
import {UserOutlined} from '@ant-design/icons';
import StudentManagement from "../component/StudentManagement";
import {getMenuList} from "../api/menu";
import { JSX } from 'react/jsx-runtime';
import {MenuManage} from "../component/MenuManage";
import DocumentManage from "../component/DocumentManage";

const initialCustomStyle: CSSProperties = {
    color: 'blue',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.8s ease-in-out'
};

//setting menu
const menuItems = [
    {key: 'Home', item: CardBox, menuName: 'Home',show:false},
    {key: 'StudentManage', item: StudentManagement, menuName: 'StudentManage',show:false},
    {key: 'DocumentManage', item: DocumentManage, menuName: 'DocumentManage',show:false},
    {key: 'MenuManage', item: MenuManage, menuName: 'MenuManage',show:false}
];

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(menuItems[0].key);

    const [menuItemsList, setMenuItemsList] = useState([...menuItems])

    useEffect(() => {
        const fetchData = async () => {
           let res:any =  await getMenuList();
            console.log('res', res)
            let menuList: [] = res.data;
            let arr: React.SetStateAction<({ key: string; item: (props: any) => JSX.Element; menuName: string; show: boolean; } | { key: string; item: React.FC<{}>; menuName: string; show: boolean; })[]> = []
            menuList.forEach(item=>{
                menuItems.forEach(it=>{
                    if (item['PageKey']==it.key){
                        it.show = true
                        arr.push(it)
                    }
                })
            })
            setMenuItemsList(arr);
        }
        fetchData();
    }, [])

    const handleItemClick = (key: string) => {
        setCurrentPage(key);
    };

    return (
        <div>
            <Menu mode="horizontal" theme="dark" style={{textAlign: 'right'}}>
                {menuItemsList.map((page) => (
                    page.show &&
                    <Menu.Item onClick={() => handleItemClick(page.key)} key={page.key} icon={<UserOutlined/>}>
                        {page.menuName}
                    </Menu.Item>
                ))}
            </Menu>
            {menuItemsList.map((page) => (
                <div key={page.key} style={{...initialCustomStyle, opacity: currentPage === page.key ? 1 : 0}}>
                    {currentPage === page.key && <page.item/>}
                </div>
            ))}
        </div>
    );
};

export default HomePage;
