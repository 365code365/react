import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select, DatePicker, Table, Divider, Modal, message} from "antd";
import ReactQuill from "react-quill";
import {getAllUser} from "../api/loginApi";
import {FormInstance} from "antd/lib/form";
import {createDocument, del, list} from "../api/cert/document"; // Import custom CSS for styling

const documentTypes = [
    {value: "Google", label: "Google"},
    {value: "Microsoft", label: "Microsoft"},
    {value: "AWS", label: "AWS"}
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
    const [datasource, setDatasource] = useState([{}]);
    const [userRole, setUserRole] = useState<string | null>(null); // State to store user role

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
        getDocumentList()

        const role = localStorage.getItem("UserRole");
        console.log('role', role)
        setUserRole(role);
    }, []);


    const getDocumentList = async () => {
        const res: any = await list();
        setDatasource(res['data'])
    }

    const handleSubmit = async (values: DocumentFormData) => {
        try {
            // Here you can handle the form submission, such as sending data to the server
            console.log("Submitted values:", values);
            // After submission, you might want to reset the form and do other tasks
            // form.resetFields();
            const res: any = await createDocument(values)
            if (res['code'] === '00000') {
                setFormVisible(false);
                getDocumentList()
            }
            console.log('res-DocumentFormData', res)
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    async function handleDelete(record: any) {
        console.log('record', record)
        const res: any = await del(record)
        if (res['code'] === '00000') {
            getDocumentList()
            message.info("delete success")
        }

    }

    const columns = [
        {title: 'ID', dataIndex: 'ID', key: 'ID'},
        {title: 'ClaimType', dataIndex: 'ClaimType', key: 'ClaimType'},
        {title: 'UserID', dataIndex: 'UserID', key: 'UserID'},
        {title: 'Date', dataIndex: 'Date', key: 'Date'},
        {title: 'Filename', dataIndex: 'Filename', key: 'Filename'},
        {title: 'Description', dataIndex: 'Description', key: 'Description'},
        {title: 'RejectionReason', dataIndex: 'RejectionReason', key: 'RejectionReason'},
        {title: 'Status', dataIndex: 'Status', key: 'Status'},
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, record: any) => (
                // Render delete button only if user is admin
                userRole === 'admin' && <Button type="primary" onClick={() => handleDelete(record)}>Delete</Button>
            ),
        }
    ];

    return (
        <>
            <Button style={{margin: '10px'}} size={'middle'} type="primary" onClick={() => setFormVisible(true)}>Add
                Document</Button>
            <div style={{marginLeft: "20px"}}>
                <Divider plain>List</Divider>
            </div>
            <Table style={{marginLeft: '10%'}} columns={columns} dataSource={datasource}/>
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
                            <Button size={'middle'} type="primary" htmlType="submit">
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
