import React, {useState} from "react";
import {Button, Form, Input, Select, DatePicker, Table, TableProps, Tag, Space, Divider} from "antd";
import {FormInstance} from "antd/lib/form";
import "../css/DocumentManagePage.css"; // Import custom CSS for styling

interface DocumentFormData {
    ID: string;
    ClaimType: string;
    ClaimID: string;
    UserID: string;
    DocumentType: string;
    Date: string;
    Filename: string;
    Description: string;
    Title: string;
    RejectionReason: string;
    Status: string;
}

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const DocumentManage: React.FC = () => {
    const [form] = useState<FormInstance<DocumentFormData>>();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: DocumentFormData) => {
        setSubmitting(true);
        // Here you can handle the form submission, such as sending data to the server
        console.log("Submitted values:", values);
        // After submission, you might want to reset the form and do other tasks
        // form.resetFields();
        setSubmitting(false);
    };


    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];


    return (
        <>
            <div className="document-manage-container"> {/* Apply custom CSS class for styling */}
                <div>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} className="document-form">
                        <Form.Item label="ID" name="ID">
                            <Input placeholder="Enter ID"/>
                        </Form.Item>

                        <Form.Item label="Claim Type" name="ClaimType">
                            <Input placeholder="Enter claim type"/>
                        </Form.Item>

                        <Form.Item label="Claim ID" name="ClaimID">
                            <Input placeholder="Enter claim ID"/>
                        </Form.Item>

                        <Form.Item label="User ID" name="UserID">
                            <Input placeholder="Enter user ID"/>
                        </Form.Item>

                        <Form.Item label="Document Type" name="DocumentType">
                            <Input placeholder="Enter document type"/>
                        </Form.Item>
                        <Form.Item label="Date" name="Date">
                            <DatePicker style={{width: "100%"}}/>
                        </Form.Item>

                    </Form>
                </div>
                <div>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} className="document-form">

                        <Form.Item label="Filename" name="Filename">
                            <Input placeholder="Enter filename"/>
                        </Form.Item>

                        <Form.Item label="Description" name="Description">
                            <Input.TextArea rows={4} placeholder="Enter description"/>
                        </Form.Item>

                        <Form.Item label="Title" name="Title">
                            <Input placeholder="Enter title"/>
                        </Form.Item>

                        <Form.Item label="Rejection Reason" name="RejectionReason">
                            <Input placeholder="Enter rejection reason"/>
                        </Form.Item>

                        <Form.Item label="Status" name="Status">
                            <Select>
                                <Select.Option value="Pending">Pending</Select.Option>
                                <Select.Option value="Approved">Approved</Select.Option>
                                <Select.Option value="Rejected">Rejected</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
            <div style={{marginLeft:"20px"}}>
                <Divider plain>list</Divider>
            </div>
            <div style={{margin:"10px",border:'1px solid black',marginLeft:"20%"}}>
                <Table columns={columns} dataSource={data}/>
            </div>
        </>
    );
};

export default DocumentManage;
