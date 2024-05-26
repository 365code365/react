import React, {useEffect, useState} from 'react';
import {Table, Button, Modal, Form, Input, Select, Upload, message} from 'antd';
import {FormInstance} from 'antd/lib/form';
import * as XLSX from 'xlsx';
import {UploadOutlined} from "@ant-design/icons";
import {login} from "../api/loginApi";
import {createUser, del, list} from "../api/cert/user";

interface Student {
    UserID: number;
    FullName: string;
    Role: number;
    Grade: string;
    Email: string;
    PasswordHash: string;
    Gender: number; // 0: Female, 1: Male, 2: Unknown
}

const StudentManagement: React.FC = () => {
    // Assume initial student data
    const [students, setStudents] = useState<Student[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null); // State to store user role

    async function handleDelete(record: any) {
        console.log('record', record)
        const res: any = await del(record);
        if (res['code'] === '00000') {
            getList()
            message.info("del success")
        }
    }

    // Table columns configuration
    const columns = [
        // { title: 'UserID', dataIndex: 'UserID', key: 'UserID' },
        {title: 'FullName', dataIndex: 'FullName', key: 'FullName'},
        {title: 'Role', dataIndex: 'Role', key: 'Role'},
        {title: 'Grade', dataIndex: 'Grade', key: 'Grade'},
        {title: 'Email', dataIndex: 'Email', key: 'Email'},
        {title: 'PasswordHash', dataIndex: 'PasswordHash', key: 'PasswordHash'},
        {title: 'Gender', dataIndex: 'Gender', key: 'Gender'},
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, record: any) => (
                // Render delete button only if user is admin
                userRole === 'admin' && <Button type="primary" onClick={() => handleDelete(record)}>Delete</Button>
            ),
        }// Other columns...
    ];


    useEffect(() => {
        getList()

        const role = localStorage.getItem("UserRole");
        console.log('role', role)
        setUserRole(role);
    }, []);

    const getList = async () => {
        const res: any = await list()
        setStudents(res['data'])
    }

    // Form related states
    const [isModalVisible, setIsModalVisible] = useState(false);

    const formRef = React.createRef<FormInstance>();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = async (values: any) => {
        console.log('values', values)
        const newStudent: Student = {
            id: students.length + 1, // Generate new ID
            ...values,
            gender: parseInt(values.gender), // Parse string value to integer
        };
        setStudents([...students, newStudent]);
        setIsModalVisible(false);
        // console.log('students', students)
        const data = [newStudent]
        const res = await createUser(data)
        console.log('studentsres', res)
        formRef.current?.resetFields();
    };

    const handleExcelUpload = (file: File | null) => {
        if (!file) return; // Check if file exists
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            if (data) {
                const workbook = XLSX.read(data, {type: 'binary'});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, {header: 1}) as any[][];

                console.log('excelData', excelData)
                // Assuming the first row contains headers
                if (excelData.length > 1) {
                    const headers: string[] = excelData[0];
                    console.log('headers', headers)
                    console.log('headers.indexOf(\'Email\')', headers.indexOf('Email'))
                    const parsedStudents = excelData.slice(1).map((row: any, index: number) => ({
                        id: index + 1,
                        UserID: row[headers.indexOf('UserID')],
                        FullName: row[headers.indexOf('FullName')],
                        Role: row[headers.indexOf('Role')],
                        Grade: row[headers.indexOf('Grade')],
                        Email: row[headers.indexOf('Email')],
                        PasswordHash: row[headers.indexOf('PasswordHash')],
                        Gender: (row[headers.indexOf('Gender')]), // Parse string value to integer
                    }));
                    console.log('parsedStudents', parsedStudents)
                    setStudents([...students, ...parsedStudents]);
                    createUser(parsedStudents)
                }
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <>
            {(userRole == 'admin' || userRole === 'teacher') &&
                <div style={{padding: '20px', textAlign: 'center'}}>
                    <Button type="primary" onClick={showModal} style={{marginBottom: '20px', marginRight: '10px'}}>Add
                        User</Button>

                    <Upload accept=".xlsx, .xls" beforeUpload={(file) => {
                        handleExcelUpload(file);
                        return false;
                    }}>

                        <Button style={{marginRight: '10px'}} icon={<UploadOutlined/>}>Click to Upload xlsx/xls</Button>

                    </Upload>
                    <a href="template.xlsx" download="Template.xlsx">
                        <Button style={{marginRight: '10px'}}>Click to Download Template</Button>
                    </a>
                    <Modal
                        title="Add User"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <Form
                            ref={formRef}
                            name="basic"
                            labelCol={{span: 6}}
                            wrapperCol={{span: 16}}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="FullName"
                                name="FullName"
                                rules={[{required: true, message: 'Please input student FullName!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            {/*  <Form.Item
                                label="Age"
                                name="age"
                                rules={[{required: true, message: 'Please input student age!'}]}
                            >
                                <Input/>
                            </Form.Item>*/}

                            <Form.Item
                                label="Grade"
                                name="Grade"
                                rules={[{required: true, message: 'Please input student grade!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="Email"
                                rules={[{required: true, message: 'Please input student email!'}]}
                            >
                                <Input type="email"/>
                            </Form.Item>

                            <Form.Item
                                label="PasswordHash"
                                name="PasswordHash"
                                rules={[{required: true, message: 'Please input student PasswordHash!'}]}
                            >
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item
                                label="Gender"
                                name="Gender"
                                rules={[{required: true, message: 'Please select student gender!'}]}
                            >
                                <Select>
                                    <Select.Option value="Female">Female</Select.Option>
                                    <Select.Option value="Male">Male</Select.Option>
                                    <Select.Option value="Unknown">Unknown</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Role"
                                name="Role"
                                rules={[{required: true, message: 'Please select Role!'}]}
                            >
                                <Select>
                                    <Select.Option value="admin">admin</Select.Option>
                                    <Select.Option value="teacher">teacher</Select.Option>
                                    <Select.Option value="student">student</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 6, span: 16}}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>}

            <div style={{margin: '0 auto', width: '80%'}}>
                <Table dataSource={students} columns={columns}/>
            </div>
        </>
    );
};

export default StudentManagement;
