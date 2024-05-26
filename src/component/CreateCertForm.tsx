import React, {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Button, Upload, message, DatePicker} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/cert/CreateCertForm.css";
import {PlusOutlined} from '@ant-design/icons';
import {getGradelist} from "../api/loginApi";
import moment from 'moment';

type CreateCertFormProps = {
    visible: boolean;
    onCancel: () => void;
    onCreate: (values: any) => void;
};

const CreateCertForm: React.FC<CreateCertFormProps> = ({visible, onCancel, onCreate}) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        gradeList();
    }, []);

    const onUploadChange = (info: any) => {
        if (info.file.status === 'done') {
            const imageUrl = info.file.response?.url;
            setImageUrl(imageUrl);
            form.setFieldsValue({CourseImage: imageUrl});
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        } else {
            getBase64(file, (imageUrl: string) => {
                setImageUrl(imageUrl);
                form.setFieldsValue({CourseImage: imageUrl});
            });
        }
        return false;
    };

    const getBase64 = (file: File, callback: (imageUrl: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(file);
    };

    const uploadButton = (
        <div>
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const gradeList = async () => {
        try {
            const res: any = await getGradelist();
            const arr = res.data.map((item: any) => ({
                value: item.Grade,
                label: item.Grade,
            }));
            setOptions(arr);
        } catch (error) {
            message.error('Failed to fetch grade list');
        }
    };

    return (
        <Modal
            visible={visible}
            title="Create Certificate"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        values.SubmissionStartDate = moment(values.SubmissionStartDate).format("YYYY-MM-DD HH:mm");
                        values.SubmissionEndDate = moment(values.SubmissionEndDate).format("YYYY-MM-DD HH:mm");
                        values.CourseStart = moment(values.CourseStart).format("YYYY-MM-DD HH:mm");
                        values.CourseEnd = moment(values.CourseEnd).format("YYYY-MM-DD HH:mm");
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.error("Validate Failed:", info);
                    });
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="grade"
                    label="Select grade"
                    rules={[{required: true, message: "Please select the grade."}]}
                >
                    <Select
                        placeholder="Select an option"
                        options={options}
                    />
                </Form.Item>

                <Form.Item
                    name="TitleOfCertification"
                    label="Certificate Title"
                    rules={[{required: true, message: "Please enter the title of the certification."}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="NameOfTrainingProvider"
                    label="Training Provider"
                    rules={[{required: true, message: "Please select the training provider."}]}
                >
                    <Select>
                        <Select.Option value="Google">Google</Select.Option>
                        <Select.Option value="Microsoft">Microsoft</Select.Option>
                        <Select.Option value="AWS">AWS</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="CourseStart"
                    label="Course Start Date"
                    rules={[{required: true, message: "Please enter the course start date."}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item
                    name="CourseEnd"
                    label="Course End Date"
                    rules={[{required: true, message: "Please enter the course end date."}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item
                    name="SubmissionStartDate"
                    label="Submission Start Date"
                    rules={[{required: true, message: "Please enter the submission start date."}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item
                    name="SubmissionEndDate"
                    label="Submission End Date"
                    rules={[{required: true, message: "Please enter the submission end date."}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item
                    name="CourseDesc"
                    label="Course Description"
                    rules={[{required: true, message: "Please enter the course description."}]}
                >
                    <ReactQuill className="quill-input" theme="snow"/>
                </Form.Item>

                <Form.Item
                    name="CourseImage"
                    label="Upload Image"
                >
                    <Upload
                        accept=".jpg,.png"
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
