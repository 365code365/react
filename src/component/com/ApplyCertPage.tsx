import React, {useState} from "react";
import {Button, DatePicker, Form, Input, message, Modal} from "antd";
import {createApply} from "../../api/cert/courseCertClaim";

interface ApplyCertPageProps {
    selectedCourseID: string
}

const ApplyCertPage: React.FC<ApplyCertPageProps> = (props: ApplyCertPageProps) => {
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [applyForm] = Form.useForm();


    const handleApplyCancel = () => {
        setApplyModalVisible(false);
    };


    const handleApplySubmit = async (values: any) => {
        try {
            // Set CourseAndCertificationID in form values
            values.ExaminationDate = new Date(values.ExaminationDate);
            values.CourseAndCertificationID = props.selectedCourseID;
            values.UserID = localStorage.getItem("UserID")
            console.log("Submitted apply cert values:", values);
            let res: any = await createApply(values);
            if (res['code'] === '00000') {
                setApplyModalVisible(false);
                message.info("apply success")
            }

            message.success('Apply Cert submitted successfully!');
        } catch (error) {
            console.error("Error submitting apply cert:", error);
            message.error('Failed to submit apply cert');
        }
    };


    return (<>
        <Button type={'primary'} onClick={()=>setApplyModalVisible(true)}>Apply Cert</Button>
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
                initialValues={{CourseAndCertificationID: props.selectedCourseID}} // Set initial value for CourseAndCertificationID
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
                <Form.Item
                    name="Remark"
                    label="Remark"
                >
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Modal></>)

}


export default ApplyCertPage
