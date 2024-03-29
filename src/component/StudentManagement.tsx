import React, { useState } from 'react';
import {Table, Button, Modal, Form, Input, Select, Upload} from 'antd';
import { FormInstance } from 'antd/lib/form';
import * as XLSX from 'xlsx';
import {UploadOutlined} from "@ant-design/icons";

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

    // Table columns configuration
    const columns = [
        { title: 'UserID', dataIndex: 'UserID', key: 'UserID' },
        { title: 'FullName', dataIndex: 'FullName', key: 'FullName' },
        { title: 'Role', dataIndex: 'Role', key: 'Role' },
        { title: 'Grade', dataIndex: 'grade', key: 'grade' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'PasswordHash', dataIndex: 'PasswordHash', key: 'PasswordHash' },
        { title: 'Gender', dataIndex: 'Gender', key: 'Gender', render: (gender: number) => (gender === 0 ? 'Female' : (gender === 1 ? 'Male' : 'Unknown')) },
        // Other columns...
    ];

    // Form related states
    const [isModalVisible, setIsModalVisible] = useState(false);

    const formRef = React.createRef<FormInstance>();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values: any) => {
        const newStudent: Student = {
            id: students.length + 1, // Generate new ID
            ...values,
            gender: parseInt(values.gender), // Parse string value to integer
        };
        setStudents([...students, newStudent]);
        setIsModalVisible(false);
        formRef.current?.resetFields();
    };

    const handleExcelUpload = (file: File | null) => {
        if (!file) return; // Check if file exists
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            if (data) {
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
                // Assuming the first row contains headers
                if (excelData.length > 1) {
                    const headers: string[] = excelData[0];
                    const parsedStudents = excelData.slice(1).map((row: any, index: number) => ({
                        id: index + 1,
                        UserID: row[headers.indexOf('UserID')],
                        FullName: row[headers.indexOf('FullName')],
                        Role: row[headers.indexOf('Role')],
                        Grade: row[headers.indexOf('Grade')],
                        Email: row[headers.indexOf('Email')],
                        PasswordHash: row[headers.indexOf('PasswordHash')],
                        Gender: parseInt(row[headers.indexOf('Gender')]), // Parse string value to integer
                    }));
                    setStudents([...students, ...parsedStudents]);
                }
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Button  type="primary" onClick={showModal} style={{ marginBottom: '20px',marginRight:'10px' }}>Add Student</Button>
            <Upload accept=".xlsx, .xls" beforeUpload={(file) => { handleExcelUpload(file); return false; }}>
                <Button style={{ marginRight: '10px' }} icon={<UploadOutlined />}>Click to Upload xlsx/xls</Button>
            </Upload>

            <div style={{ margin: '0 auto', width: '80%' }}>
                <Table dataSource={students} columns={columns} />
            </div>

            <Modal
                title="Add Student"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    ref={formRef}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input student name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Age"
                        name="age"
                        rules={[{ required: true, message: 'Please input student age!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Grade"
                        name="grade"
                        rules={[{ required: true, message: 'Please input student grade!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input student email!' }]}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input student password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please select student gender!' }]}
                    >
                        <Select>
                            <Select.Option value="0">Female</Select.Option>
                            <Select.Option value="1">Male</Select.Option>
                            <Select.Option value="2">Unknown</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StudentManagement;
