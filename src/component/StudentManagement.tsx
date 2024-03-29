import React, { useState } from 'react';
import {Table, Button, Modal, Form, Input, Select, Upload} from 'antd';
import { FormInstance } from 'antd/lib/form';
import * as XLSX from 'xlsx';
import {UploadOutlined} from "@ant-design/icons";

interface Student {
    id: number;
    name: string;
    age: number;
    grade: string;
    email: string;
    password: string;
    gender: number; // 0: Female, 1: Male, 2: Unknown
}

const StudentManagement: React.FC = () => {
    // Assume initial student data
    const [students, setStudents] = useState<Student[]>([
        { id: 1, name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com', password: 'password1', gender: 1 },
        { id: 2, name: 'Jane Smith', age: 21, grade: 'B', email: 'jane@example.com', password: 'password2', gender: 0 },
        // Other student data...
    ]);

    // Table columns configuration
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Grade', dataIndex: 'grade', key: 'grade' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Password', dataIndex: 'password', key: 'password' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', render: (gender: number) => (gender === 0 ? 'Female' : (gender === 1 ? 'Male' : 'Unknown')) },
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
                        name: row[headers.indexOf('Name')],
                        age: row[headers.indexOf('Age')],
                        grade: row[headers.indexOf('Grade')],
                        email: row[headers.indexOf('Email')],
                        password: row[headers.indexOf('Password')],
                        gender: parseInt(row[headers.indexOf('Gender')]), // Parse string value to integer
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
