import {Button, Divider, message, Select, Table} from "antd"
import {SetStateAction, useEffect, useState} from "react";
import {addRole, getAllUser} from "../api/loginApi";
import "../css/cert/CreateCertForm.css";
import '../css/common.css'

const columns = [
    {
        title: 'UserID',
        dataIndex: 'UserID',
        key: 'UserID',
    },
    {
        title: 'FullName',
        dataIndex: 'FullName',
        key: 'FullName',
    },
    {
        title: 'Role',
        dataIndex: 'Role',
        key: 'Role',
    }
];


export const MenuManage = (prop: any) => {
    const [options, setOptions] = useState([{}]);
    const [dataSource, setDataSource] = useState<any>([]);
    const [user, setUser] = useState<any>({UserID:'',Role:''});


    useEffect(() => {
        const fetchData = async () => {
            let studdentRes: any = await getAllUser();
            let studentList = getStudentList(studdentRes);

            setOptions(studentList)
            setDataSource(studdentRes['data'])
        }
        fetchData()
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


    function handleChange(type:string,e: any) {
        if (type === 'role'){
          user.Role = e
        }
        if (type=='userId'){
            user.UserID = e
        }
        setUser(user)

    }


    async function submitForm() {
        if (!user.Role){
            message.warning("please select role")
            return
        }
        if (!user.UserID){
            message.warning("please select User")
            return
        }

         await addRole(user)
    }

    return (<>

        <div className={'common-select'}>
            <div style={{padding: '10px', borderRadius: '10px', textAlign: 'center'}}>
                <h2>this page permission page</h2>
            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                <div style={{margin: '10px'}}> Please select person</div>
                <Select
                    defaultValue="Select an option"
                    style={{minWidth: '200px'}}
                    placeholder="Tags Mode"
                    onChange={(e) => {
                        handleChange("userId", e)
                    }}
                    options={options}
                />
            </div>
            <div style={{marginTop: '20px'}} className={'common-select'}>

                <div>
                    <div><Select
                          defaultValue="Select an option"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={(e) => {
                                handleChange("role", e)
                            }}
                            options={[
                                {label: 'admin', value: 'admin'},
                                {label: 'teacher', value: 'teacher'},
                                {label: 'student', value: 'student'}
                            ]}/>
                    </div>
                </div>
            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                <Button type={'primary'} onClick={submitForm}>submit</Button>
            </div>
        </div>
        <Divider>menu list</Divider>
        <div  className={'common-select'}>
            <Table dataSource={dataSource} columns={columns}/>
        </div>
    </>)
}
