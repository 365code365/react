import {Button, Checkbox, Select, SelectProps} from "antd"
import {SetStateAction, useEffect, useState} from "react";
import {getAllUser} from "../api/loginApi";
import "../css/CreateCertForm.css";

export const MenuManage = (prop: any) => {
    const [options, setOptions] = useState([{}]);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            let studdentRes: any = await getAllUser();
            console.log('studdentRes', studdentRes)
            let studentList = getStudentList(studdentRes);
            console.log('studentList', studentList)
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


    function handleChange(e: any) {

    }

    function onChange1(e: any) {
        setChecked1(e.target.checked);
    }

    function onChange2(e: any) {
        setChecked2(e.target.checked);
    }

    function onChange3(e: any) {
        setChecked3(e.target.checked);
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
                    onChange={handleChange}
                    options={options}
                />
            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>

                <div>
                    <Checkbox checked={checked1} onChange={onChange1}>
                        <div className={'menu-item'}>StudentManage</div>
                    </Checkbox>
                    <div>
                        {checked1 ? <Select
                            mode="tags"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={handleChange}
                            options={[
                                {label: 'add', value: 'add'},
                                {label: 'del', value: 'del'},
                                {label: 'import', value: 'import'},
                            ]}/> : ''}
                    </div>
                </div>

                <div>
                    <Checkbox checked={checked2} onChange={onChange2}>
                        <div className={'menu-item'}>DocumentManage</div>
                    </Checkbox>
                    <div>
                        {checked2 ? <Select
                            mode="tags"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={handleChange}
                            options={[
                                {label: 'add', value: 'add'},
                                {label: 'del', value: 'del'},
                                {label: 'import', value: 'import'},
                            ]}/> : ''}
                    </div>
                </div>
                <div>
                    <Checkbox checked={checked3} onChange={onChange3}>
                        <div className={'menu-item'}>MenuManage</div>
                    </Checkbox>
                    <div>
                        {checked3 ? <Select
                            mode="tags"
                            style={{minWidth: '200px'}}
                            placeholder="Tags Mode"
                            onChange={handleChange}
                            options={[
                                {label: 'add', value: 'add'},
                                {label: 'del', value: 'del'},
                                {label: 'import', value: 'import'},
                            ]}/> : ''}
                    </div>
                </div>

            </div>
            <div style={{marginLeft: '20px', marginTop: '20px'}}>
                <Button type={'primary'}>submit</Button>
            </div>
        </div>
    </>)
}
