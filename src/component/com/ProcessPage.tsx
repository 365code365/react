import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select} from "antd";
import {getListById, updateCertClaim} from "../../api/cert/courseCertClaim";

interface ProcessPageProps {
    selectedCourseID: string
}

const ProcessPage: React.FC<ProcessPageProps> = (props: ProcessPageProps) => {
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [applyForm] = Form.useForm();


    const [applyListOptions, setApplyListOptions] = useState<any>([]);

    useEffect(() => {
        getApplyListAll();
    }, []);

    const getApplyListAll = async () => {
        let res: any = await getListById();
        setApplyListOptions(res["data"])

    };

    async function handleApprovalSubmit(values: any) {
        let data = {
            CourseAndCertificationID: props.selectedCourseID,
            ...values
        }
        console.log('values', data)
        let res: any = await updateCertClaim(data)
        if (res['code'] === '00000') {
            message.info('submit success')
            setApproveModalVisible(false)
        }
    }


    function handleChange(e: any) {

    }

    function handleApproval(item: any) {
        setApproveModalVisible(true);
    }

    return (<>   <Button type="primary" onClick={() => handleApproval(props)}>Approval Process</Button> <Modal
        title="Approval Process"
        visible={approveModalVisible}
        onCancel={() => {
            setApproveModalVisible(false)
        }}
        onOk={() => applyForm.submit()}
        okText="Submit"
    >
        <Form
            form={applyForm}
            onFinish={handleApprovalSubmit}
            layout="vertical"
            initialValues={{CourseAndCertificationID: props.selectedCourseID}} // Set initial value for CourseAndCertificationID
        >

            <Form.Item
                name="UserID"
                label="UserID"
                rules={[{required: true, message: 'Please enter total amount spent'}]}
            >
                <Select
                    defaultValue="Select an student"
                    style={{minWidth: '200px'}}
                    placeholder="Tags Mode"
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    options={applyListOptions}/>
            </Form.Item>
            <Form.Item
                name="Status"
                label="Status"
                rules={[{required: true, message: 'Please enter total amount spent'}]}
            >
                <Select
                    defaultValue="Select an option"
                    style={{minWidth: '200px'}}
                    placeholder="Tags Mode"
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    options={[
                        {label: 'Submit', value: 'Submit'},
                        {label: 'Pending', value: 'Pending'},
                        {label: 'Reject', value: 'Reject'},
                        {label: 'Finish', value: 'Finish'}
                    ]}/>
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

export default ProcessPage
