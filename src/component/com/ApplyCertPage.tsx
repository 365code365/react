import React, {useState} from "react";
import {Button, DatePicker, Form, Image, Input, message, Modal, Upload} from "antd";
import {createApply} from "../../api/cert/courseCertClaim";
import {createDocument} from "../../api/cert/document";

interface ApplyCertPageProps {
    selectedCourseID: string;
}

const ApplyCertPage: React.FC<ApplyCertPageProps> = (props: ApplyCertPageProps) => {
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [additionalInfoModalVisible, setAdditionalInfoModalVisible] = useState(false);
    const [applyForm] = Form.useForm();
    const [additionalInfoForm] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]); // State to store uploaded files
    const [fileContent, setFileContent] = useState<any>(); // State to store uploaded files
    const [listInfo, setListInfo] = useState<any[]>([]); // State to store uploaded files


    const [additionalInfo, setAdditionalInfo] = useState<any>({})

    const handleApplyCancel = () => {
        setApplyModalVisible(false);
    };

    const handleAdditionalInfoCancel = () => {
        setAdditionalInfoModalVisible(false);
    };

    const handleApplySubmit = async (values: any) => {
        try {
            console.log('values', values)
            values.ExaminationDate = new Date(values.ExaminationDate);
            values.CourseAndCertificationID = props.selectedCourseID;
            values.UserID = localStorage.getItem("UserID");

            let res: any = await createApply(values);
            if (res['code'] === '00000') {
                setApplyModalVisible(false);
                message.info("Apply success");
            }

            listInfo.forEach((item: any) => {
                item.ClaimlD = props.selectedCourseID;
                item.UserID = localStorage.getItem("UserID");
                createDocument(item)
            })

            message.success('Apply Cert submitted successfully!');
        } catch (error) {
            console.error("Error submitting apply cert:", error);
            message.error('Failed to submit apply cert');
        }
    };

    const handleAdditionalInfoSubmit = async (values: any) => {
        try {
            console.log("额外信息:", values);
            values['FileContent'] = fileContent
            listInfo.push(values)
            console.log('listInfo', listInfo)
            setListInfo(listInfo)
            setAdditionalInfoModalVisible(false);
            message.success('额外信息提交成功！');
        } catch (error) {
            console.error("提交额外信息出错:", error);
            message.error('提交额外信息失败');
        }
    };

    const handleFileChange = (info: any) => {
        // Filter out successfully uploaded files and update the fileList state
        const fileList = info.fileList.map((file: any) =>
            file.response ? file.response.url : file
        );

        if (fileList.length > 0) {

            const reader = new FileReader();
            reader.readAsDataURL(fileList[0].originFileObj);
            reader.onload = () => {
                const base64String = reader.result?.toString().split(",")[1]; // Extract base64 string
                console.log('fileList', base64String)
                setFileContent(base64String)
            };
        }

        setFileList(fileList);
    };

    const handleDelete = (index: number) => {
        const newListInfo = [...listInfo];
        newListInfo.splice(index, 1);
        setListInfo(newListInfo);
    };

    return (
        <>
            <Button type="primary" onClick={() => setApplyModalVisible(true)}>
                Apply
            </Button>
            <Modal
                title="Apply Certificate"
                visible={applyModalVisible}
                onCancel={handleApplyCancel}
                onOk={() => applyForm.submit()}
                okText="Submit"
            >
                <Form
                    form={applyForm}
                    onFinish={handleApplySubmit}
                    layout="vertical"
                    initialValues={{CourseAndCertificationID: props.selectedCourseID}}
                >
                    <Form.Item
                        name="TotalClaimAmount"
                        label="Total Claim Amount"
                        rules={[{required: true, message: 'Please enter total claim amount'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="TotalAmountSpent"
                        label="Total Amount Spent"
                        rules={[{required: true, message: 'Please enter total amount spent'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="ExaminationDate"
                        label="Examination Date"
                        rules={[{required: true, message: 'Please select examination date'}]}
                    >
                        <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                    </Form.Item>
                </Form>


                <Button type="default" onClick={() => setAdditionalInfoModalVisible(true)}>
                    Additional Info
                </Button>
                <Modal
                    title="Additional Information"
                    visible={additionalInfoModalVisible}
                    onCancel={handleAdditionalInfoCancel}
                    onOk={() => additionalInfoForm.submit()}
                    okText="Submit"
                >
                    <Form form={additionalInfoForm} onFinish={handleAdditionalInfoSubmit} layout="vertical">
                        <Form.Item
                            name="Title"
                            label="Title"
                            rules={[{required: true, message: 'Please enter a title'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="Description"
                            label="Description"
                            rules={[{required: true, message: 'Please enter a description'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                        <Form.Item
                            name="RejectionReason"
                            label="Rejection *"
                            rules={[{required: true, message: 'Please enter a Rejection reason'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                        <Form.Item
                            name="FileContent"
                            label="FileContent"
                        ><Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                            listType="picture-card" // Display uploaded images as cards
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                        </Form.Item>
                    </Form>
                </Modal>
                <h3>List Information</h3>
                {listInfo.length > 0 && (
                    <div style={{borderTop: '1px solid #ccc', paddingTop: '20px'}}>
                        {listInfo.map((item: any, index: number) => (
                            <div key={index} style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div>
                                    <p><strong>Title:</strong> {item.Title}</p>
                                    <p><strong>Description:</strong> {item.Description}</p>
                                    <p><strong>Rejection Reason:</strong> {item.RejectionReason}</p>
                                </div>
                                <Image style={{width: "100px", height: "100px"}}
                                       src={`data:image/jpeg;base64, ${item.FileContent}`}/>
                                <Button type="link" onClick={() => handleDelete(index)}>Delete</Button>
                            </div>
                        ))}
                    </div>
                )}

            </Modal>
        </>
    );
};

export default ApplyCertPage;
