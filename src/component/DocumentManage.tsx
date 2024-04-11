import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select, DatePicker, Table, Divider, Modal} from "antd";
import ReactQuill from "react-quill";
import {getAllUser} from "../api/loginApi";
import {FormInstance} from "antd/lib/form";
import {create} from "../api/cert/document"; // Import custom CSS for styling

const documentTypes = [
    {value: "Google", label: "Google"},
    {value: "Microsoft", label: "Microsoft"}
];

const data = [
    {
        key: '1',
        ID: '1',
        ClaimType: 'Type A',
        ClaimID: '123',
        UserID: 'user1',
        DocumentType: 'Type X',
        Date: '2024-04-11',
        Filename: 'file1.txt',
        Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        RejectionReason: '',
        Status: 'Pending'
    },
    {
        key: '2',
        ID: '2',
        ClaimType: 'Type B',
        ClaimID: '456',
        UserID: 'user2',
        DocumentType: 'Type Y',
        Date: '2024-04-10',
        Filename: 'file2.doc',
        Description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        RejectionReason: 'Invalid format',
        Status: 'Rejected'
    },
    {
        key: '3',
        ID: '3',
        ClaimType: 'Type C',
        ClaimID: '789',
        UserID: 'user3',
        DocumentType: 'Type Z',
        Date: '2024-04-09',
        Filename: 'file3.pdf',
        Description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        RejectionReason: '',
        Status: 'Approved'
    },
];


interface DocumentFormData {
    Title: string;
    ClaimType: string;
    UserID: string;
    DocumentType: string;
    Date: string; // You might want to use a Date type here depending on your backend
    Filename: string;
    RejectionReason: string;
    Status: string;
}


const DocumentManage: React.FC = () => {
    const [form] = useState<FormInstance<DocumentFormData>>();
    const [formVisible, setFormVisible] = useState(false);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentRes: any = await getAllUser();
                const studentList = studentRes.data.map((item: any) => ({
                    value: item.UserID,
                    label: item.FullName
                }));
                setUserList(studentList);
            } catch (error) {
                console.error("Error fetching user list:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (values: DocumentFormData) => {
        try {
            // Here you can handle the form submission, such as sending data to the server
            console.log("Submitted values:", values);
            // After submission, you might want to reset the form and do other tasks
            // form.resetFields();
            let res:any = await create(values)
            if (res['code']==='00000'){
                setFormVisible(false);
            }
            console.log('res-DocumentFormData',res)
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const columns = [
        {title: 'ID', dataIndex: 'ID', key: 'ID'},
        {title: 'ClaimType', dataIndex: 'ClaimType', key: 'ClaimType'},
        {title: 'ClaimID', dataIndex: 'ClaimID', key: 'ClaimID'},
        {title: 'UserID', dataIndex: 'UserID', key: 'UserID'},
        {title: 'DocumentType', dataIndex: 'DocumentType', key: 'DocumentType'},
        {title: 'Date', dataIndex: 'Date', key: 'Date'},
        {title: 'Filename', dataIndex: 'Filename', key: 'Filename'},
        {title: 'Description', dataIndex: 'Description', key: 'Description'},
        {title: 'RejectionReason', dataIndex: 'RejectionReason', key: 'RejectionReason'},
        {title: 'Status', dataIndex: 'Status', key: 'Status'}
    ];

    return (
        <>
            <Button style={{margin: '10px'}} size="large" type="primary" onClick={() => setFormVisible(true)}>Add
                Document</Button>
            <div style={{marginLeft: "20px"}}>
                <Divider plain>List</Divider>
            </div>
            <Table style={{marginLeft: '10%'}} columns={columns} dataSource={data}/>
            <Modal width={'700px'}
                   visible={formVisible}
                   onCancel={() => setFormVisible(false)} onOk={() => {
                setFormVisible(true)
            }}
                   footer={null}
            >
                <div style={{height: '600px', overflow: 'auto'}}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="document-form"
                        initialValues={{remember: true}}
                    >
                        <Form.Item label="Title" name="Title">
                            <Input placeholder="Enter title"/>
                        </Form.Item>
                        <Form.Item label="Claim Type" name="ClaimType">
                            <Select defaultValue="Select an option" style={{minWidth: '200px'}} placeholder="Tags Mode"
                                    options={documentTypes}/>
                        </Form.Item>
                        <Form.Item label="Select User" name="UserID">
                            <Select defaultValue="Select an option" style={{minWidth: '200px'}} placeholder="Tags Mode"
                                    options={userList}/>
                        </Form.Item>
                        <Form.Item label="Date" name="Date">
                            <DatePicker style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item label="Filename" name="Filename">
                            <Input placeholder="Enter filename"/>
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
                        <Form.Item label="Description" name="Description">
                            <ReactQuill className="quill-input" theme="snow"/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 8, span: 16}}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default DocumentManage;
