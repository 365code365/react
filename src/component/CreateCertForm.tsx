import React from "react";
import {Modal, Form, Input, Select, Button} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/CreateCertForm.css"; // 导入样式文件

type CreateCertFormProps = {
    visible: boolean;
    onCancel: () => void;
    onCreate: (values: any) => void;
};

const CreateCertForm: React.FC<CreateCertFormProps> = ({
                                                           visible,
                                                           onCancel,
                                                           onCreate,
                                                       }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Create Certificate"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.error("Validate Failed:", info);
                    });
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="certName"
                    label="Certificate Name"
                    rules={[{required: true, message: "Please enter the certificate name."}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="certType"
                    label="Certificate Type"
                    rules={[{required: true, message: "Please enter the certificate name."}]}
                >
                    <Select>
                        <Select.Option value="Type1">Type 1</Select.Option>
                        <Select.Option value="Type2">Type 2</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="certDesc"
                    label="Certificate Description"
                    rules={[{required: true, message: "Please enter the certificate description."}]}
                >
                    <ReactQuill className="quill-input" theme="snow"/>
                </Form.Item>
                <Form.Item
                    name="selectedStudent"
                    label="Select Student"
                    rules={[{required: true, message: "Please select the student."}]}
                >
                    <Select>
                        <Select.Option value="Student1">Student 1</Select.Option>
                        <Select.Option value="Student2">Student 2</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCertForm;