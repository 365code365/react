import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Upload, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/CreateCertForm.css"; // 导入样式文件
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

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
    const [imageUrl, setImageUrl] = useState<string | null>(null); // 用于存储上传图片的预览 URL

    // 上传图片之后的回调函数
    const onUploadChange = (info: any) => {
        if (info.file.status === 'done') {
            // 获取上传成功的图片链接
            const imageUrl = info.file.response.url;
            setImageUrl(imageUrl);
        }
    };

    // 上传图片之前的校验函数
    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        console.log('File',file)
        setImageUrl(URL.createObjectURL(file));
        return false;
    };

    const uploadButton = (
        <div>
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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
                    rules={[{ required: true, message: "Please enter the certificate name." }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="certType"
                    label="Certificate Type"
                    rules={[{ required: true, message: "Please enter the certificate type." }]}
                >
                    <Select>
                        <Select.Option value="Type1">Type 1</Select.Option>
                        <Select.Option value="Type2">Type 2</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="certDesc"
                    label="Certificate Description"
                    rules={[{ required: true, message: "Please enter the certificate description." }]}
                >
                    <ReactQuill className="quill-input" theme="snow" />
                </Form.Item>
                <Form.Item
                    name="selectedStudent"
                    label="Select Student"
                    rules={[{ required: true, message: "Please select the student." }]}
                >
                    <Select>
                        <Select.Option value="Student1">Student 1</Select.Option>
                        <Select.Option value="Student2">Student 2</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="uploadImage"
                    label="Upload Image"
                >
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={onUploadChange}
                    >
                        {uploadButton}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCertForm;