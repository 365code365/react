import React, {SetStateAction, useEffect, useState} from "react";
import {Modal, Form, Input, Select, Button, Upload, message, DatePicker} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/cert/CreateCertForm.css"; // import  css
import {UploadOutlined, PlusOutlined} from '@ant-design/icons';
import {getAllUser, getGradelist} from "../api/loginApi";
import moment from 'moment'; // Import moment library for date formatting

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
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [options, setOptions] = useState([{}]);

    useEffect(() => {
        // getList()
        gradelist()
    }, []);

    const getList = async () => {
        const userListRes: any = await getAllUser();
        const userList = getUserList(userListRes);
        setOptions(userList)
    }

    function getUserList(res: any) {
        const arr: SetStateAction<{}[]> = []
        res['data'].forEach((item: any) => {
            const value = {
                value: item['UserID'],
                label: item['FullName'],
            }
            arr.push(value);
        })
        return arr
    }

    // upload image success result
    const onUploadChange = (info: any) => {
        if (info.file.status === 'done') {
            // get image url
            const imageUrl = info.file.response.url;
            setImageUrl(imageUrl);
        }
    };

    // check function
    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        } else {
            getBase64(file, (imageUrl: string) => {
                setImageUrl(imageUrl);
                form.setFieldsValue({CourseImage: imageUrl}); // Assign base64 string to form field
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

    const handleChange = (e: any) => {
    };

    const gradelist = async () => {
        const res = await getGradelist()
        console.log('getGradelist', res)
        const arr: SetStateAction<{}[]> = []
        res['data'].forEach((item: any) => {
            const value = {
                value: item['Grade'],
                label: item['Grade'],
            }
            arr.push(value);
        })
        setOptions(arr)
    }

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

                        values.SubmissionStartDate = moment(values.SubmissionStartDate).format("YYYY-MM-DD HH:mm");
                        values.SubmissionEndDate = moment(values.SubmissionEndDate).format("YYYY-MM-DD HH:mm");
                        values.CourseStart = moment(values.CourseStart).format("YYYY-MM-DD HH:mm");
                        values.CourseEnd = moment(values.CourseEnd).format("YYYY-MM-DD HH:mm");

                        // form.resetFields();
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
                        defaultValue="Select an option"
                        style={{minWidth: '200px'}}
                        placeholder="Tags Mode"
                        onChange={(e) => {
                            handleChange(e)
                        }}
                        options={options}
                    />
                </Form.Item>

                <Form.Item
                    name="TitleOfCertification"
                    label="Certificate TitleOfCertification"
                    rules={[{required: true, message: "Please enter the TitleOfCertification"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="NameOfTrainingProvider"
                    label="NameOfTrainingProvider"
                    rules={[{required: true, message: "Please enter the NameOfTrainingProvider."}]}
                >
                    <Select>
                        <Select.Option value="Google">Google</Select.Option>
                        <Select.Option value="Microsoft">Microsoft</Select.Option>
                        <Select.Option value="AWS">AWS</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="CourseStart"
                    label="Certificate CourseStart"
                    rules={[{required: true, message: "Please enter the CourseStart"}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item
                    name="CourseEnd"
                    label="Certificate CourseEnd"
                    rules={[{required: true, message: "Please enter the CourseEnd"}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>
                <Form.Item
                    name="SubmissionStartDate"
                    label="Certificate SubmissionStartDate"
                    rules={[{required: true, message: "Please enter the SubmissionStartDate"}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>
                <Form.Item
                    name="SubmissionEndDate"
                    label="Certificate SubmissionEndDate"
                    rules={[{required: true, message: "Please enter the SubmissionEndDate"}]}
                >
                    <DatePicker style={{width: "100%"}} showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>


                {/*  <Form.Item
                    name="AdminNum"
                    label="Certificate AdminNum"
                    rules={[{required: true, message: "Please enter the AdminNum"}]}
                >
                    <Input/>
                </Form.Item>*/}

                <Form.Item
                    name="CourseDesc"
                    label="Certificate CourseDescription"
                    rules={[{required: true, message: "Please enter the certificate description."}]}
                >
                    <ReactQuill className="quill-input" theme="snow"/>
                </Form.Item>

                <Form.Item
                    name="CourseImage"
                    label="Upload Image"
                >
                    <Upload
                        accept={'.jpg,.png'}
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
