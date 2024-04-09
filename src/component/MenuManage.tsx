import {Button, Checkbox, Divider, message, Select, SelectProps, Table} from "antd"
import {SetStateAction, useEffect, useState} from "react";
import {getAllUser} from "../api/loginApi";
import "../css/CreateCertForm.css";
import {batchAddMenu, getMenuAllList} from "../api/menu";
import '../css/common.css'

const columns = [
    {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
    },
    {
        title: 'Menu Title',
        dataIndex: 'MenuTitle',
        key: 'MenuTitle',
    },
    {
        title: 'Page Key',
        dataIndex: 'PageKey',
        key: 'PageKey',
    },
    {
        title: 'User ID',
        dataIndex: 'UserID',
        key: 'UserID',
    },
    {
        title: 'Btn Permits Flag',
        dataIndex: 'BtnPermitsFlag',
        key: 'BtnPermitsFlag',
    },
];


export const MenuManage = (prop: any) => {
    const [options, setOptions] = useState([{}]);
    const [dataSource, setDataSource] = useState<any>([]);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [formData, setFormData] = useState<any>({});


    useEffect(() => {
        const fetchData = async () => {
            let studdentRes: any = await getAllUser();
            let studentList = getStudentList(studdentRes);

            setOptions(studentList)
        }
        const fetchMenuData = async () => {
            let menuRes: any = await getMenuAllList();
            setDataSource(menuRes['data'])
        }
        fetchData()
        fetchMenuData()
    }, [])


    function getStudentList(res: any) {
        let arr: SetStateAction<{}[]> = []
        res['data'].forEach((item: any) => {

            let value = {
                value: item['UserID'],
                label: item['FullName'],
            }
            arr.push(value);
        })
        return arr
    }


    function handleChange(key: string, e: any) {
        if (formData['userId'] && key == 'userId') {
            formData['userId'] = e;
        } else {

            formData[key] = e;
        }
    }

    function studentManageChange(e: any) {
        setChecked1(e.target.checked);
    }

    function documentManageChange(e: any) {
        setChecked2(e.target.checked);
    }

    function menuManageChange(e: any) {
        setChecked3(e.target.checked);
    }

    function buildParam(formData: any) {
        let userId = formData.userId;
        if (!userId) {
            message.warning("please select person")
        }
        delete formData.userId
        let arr: { MenuTitle: string; PageKey: string; UserID: any; BtnPermitsFlag: any; }[] = []
        userId.forEach((item: any) => {

            for (let key in formData) {
                let formDatum = formData[key];
                let obj = {
                    MenuTitle: key,
                    PageKey: key,
                    UserID: item,
                    BtnPermitsFlag: formData[key].join(","),
                }
                arr.push(obj)
            }

        })

        return arr

    }

    async function submitForm() {

        let buildParam1 = buildParam(formData);

        let res = await batchAddMenu(buildParam1)
    }

    return (<>

        <div style={{marginLeft: '300px'}} className={'common-select'}>
            <div style={{padding: '10px', borderRadius: '10px', textAlign: 'center'}}>
                <h2>this page permission page</h2>
            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                <div style={{margin: '10px'}}> Please select person</div>
                <Select
                    mode="tags"
                    style={{minWidth: '200px'}}
                    placeholder="Tags Mode"
                    onChange={(e) => {
                        handleChange("userId", e)
                    }}
                    options={options}
                />
            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}} className={'common-select'}>

                <div>
                    <Checkbox checked={checked1} onChange={studentManageChange}>
                        <div className={'menu-item'}>StudentManage</div>
                    </Checkbox>
                    <div>
                        {checked1 ? <Select
                            mode="tags"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={(e) => {
                                handleChange("StudentManage", e)
                            }}
                            options={[
                                {label: 'add', value: 'add'},
                                {label: 'del', value: 'del'},
                                {label: 'update', value: 'update'},
                                {label: 'import', value: 'import'},
                                {label: 'view', value: 'view'},
                            ]}/> : ''}
                    </div>
                </div>
                <div>
                    <Checkbox checked={checked2} onChange={documentManageChange}>
                        <div className={'menu-item'}>DocumentManage</div>
                    </Checkbox>
                    <div>
                        {checked2 ? <Select
                            mode="tags"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={(e) => {
                                handleChange("DocumentManage", e)
                            }}
                            options={[
                                {label: 'add', value: 'add'},
                                {label: 'del', value: 'del'},
                                {label: 'update', value: 'update'},
                                {label: 'import', value: 'import'},
                                {label: 'view', value: 'view'},
                            ]}/> : ''}
                    </div>
                </div>
                <div>
                    <Checkbox checked={checked3} onChange={menuManageChange}>
                        <div className={'menu-item'}>MenuManage</div>
                    </Checkbox>
                    <div>
                        {checked3 ? <Select
                            mode="tags"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={(e) => {
                                handleChange("MenuManage", e)
                            }}
                            options={[
                                {label: 'add', value: 'add'},
                                {label: 'del', value: 'del'},
                                {label: 'update', value: 'update'},
                                {label: 'import', value: 'import'},
                                {label: 'view', value: 'view'},
                            ]}/> : ''}
                    </div>
                </div>

            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                <Button type={'primary'} onClick={submitForm}>submit</Button>
            </div>
        </div>
        <Divider>menu list</Divider>
        <div style={{marginLeft: '20%'}} className={'common-select'}>
            <Table dataSource={dataSource} columns={columns}/>
        </div>
    </>)
}
