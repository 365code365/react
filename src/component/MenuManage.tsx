import {Button, Checkbox, Select, SelectProps} from "antd"
import {SetStateAction, useEffect, useState} from "react";
import {getAllUser} from "../api/loginApi";
import "../css/CreateCertForm.css";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import {batchAddMenu} from "../api/menu";

export const MenuManage = (prop: any) => {
    const [options, setOptions] = useState([{}]);

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
        fetchData()
    }, [])


    function getStudentList(res: any) {
        let arr: SetStateAction<{}[]> = []
        res['data'].forEach((item: any) => {
            console.log("item", item)
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
            console.log('key', key)
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
        delete formData.userId
        console.log('formData', formData)
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

        console.log('arr', arr)
        return arr

    }

    async function submitForm() {

        let buildParam1 = buildParam(formData);

        let res = await batchAddMenu(buildParam1)
        console.log('res', res)
    }

    return (<>

        <div style={{marginLeft: '300px'}}>
            <div style={{border: '1px solid black', padding: '10px', borderRadius: '10px', textAlign: 'center'}}>
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
            <div style={{marginLeft: '20px', marginTop: '20px'}}>

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
    </>)
}
