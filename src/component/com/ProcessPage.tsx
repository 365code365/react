import React, {useState} from "react";
import {Button, Form, Image, Input, message, Modal, Select, Steps} from "antd";
import {getDetail, getListById, updateCertClaim} from "../../api/cert/courseCertClaim";

const {Step} = Steps;


interface ProcessPageProps {
    CourseAndCertificationID: string
}

interface StepModel {
    aproveRole: string
    order: string
    status?: "wait" | "process" | "finish" | "error"; // Added status type
}

const ProcessPage: React.FC<ProcessPageProps> = (props: ProcessPageProps) => {
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [applyForm] = Form.useForm();

    const [listInfo, setListInfo] = useState<any[]>([]); // State to store uploaded files

    const [applyListOptions, setApplyListOptions] = useState<any>([]);

    const [selectedApply, setSelectedApply] = useState<any>(null);

    const [approveStatus, setApproveStatus] = useState<any>(null);
    const [approvalProcess, setApprovalProcess] = useState<StepModel[]>([]);

    const getApplyListAll = async () => {

        const param = {
            CourseAndCertificationID: props.CourseAndCertificationID
        }
        const res: any = await getListById(param);
        setApplyListOptions(res["data"])

        const ruleRes: any = await getDetail({ID: props.CourseAndCertificationID});
        const applyRuleJson = JSON.parse(ruleRes.data.applyRule);
        console.log('ruleRes',applyRuleJson)
        setApprovalProcess(applyRuleJson)

    };

    async function handleApprovalSubmit(values: any) {
        const data = {
            CourseAndCertificationID: props.CourseAndCertificationID,
            ...values
        }
        if (!approveStatus) {
            message.warning('Please select  approveStatus')
        }
        data['Status'] = approveStatus
        console.log('values', data)
        const res: any = await updateCertClaim(data)
        if (res['code'] === '00000') {
            message.info('submit success')
            setApproveModalVisible(false)
        }
    }


    function handleChange(e: any) {
        console.log('handleChange', handleChange)
        getDetailInfo(e)
    }

    function handleApproveChange(e: any) {
        setApproveStatus(e)
    }

    function handleApproval() {
        setApproveModalVisible(true);
    }


    const getDetailInfo = async (value: any) => {

        const param = {
            CourseAndCertificationID: props.CourseAndCertificationID,
            UserID: value
        }
        const res: any = await getDetail(param)
        if (res['code'] === '00000' && res['data']) {
            console.log('getDetail', res)
            const resData = {
                TotalAmountSpent: res.data.TotalAmountSpent,
                TotalClaimAmount: res.data.TotalClaimAmount,
                Remark: res.data.Remark,
                ExaminationDate: res.data.ExaminationDate
            }
            setSelectedApply(resData);
            setListInfo(res['data']['documentList'])
        } else {
            message.warning("apply is empty")
        }

    };


    return (<>
        <Button type="primary" onClick={() => {
            getApplyListAll()
            handleApproval()
        }}>Process</Button> <Modal
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
            initialValues={{CourseAndCertificationID: props.CourseAndCertificationID}} // Set initial value for CourseAndCertificationID
        >

            <Form.Item>

                <Steps
                    current={0}>
                    {approvalProcess.map((step, index) => (
                        // <Step key={index} title={step.aproveRole} description={step.aproveRole}
                        //       status={step.aproveRole}/>
                        <Step key={index} title={step.aproveRole} description={step.aproveRole}
                              status={step.status}/>
                    ))}
                </Steps>
            </Form.Item>

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
                        handleApproveChange(e)
                    }}

                    options={[
                        {label: 'Submit', value: 'Submit'},
                        {label: 'Pending', value: 'Pending'},
                        {label: 'Reject', value: 'Reject'},
                        {label: 'approve', value: 'Finish'}
                    ]}/>
            </Form.Item>
            <Form.Item
                name="Remark"
                label="Remark"
            >
                <Input.TextArea/>
            </Form.Item>
            {selectedApply && (
                <div style={{padding: "20px"}}>
                    <p><strong>Total Claim Amount:</strong> {selectedApply.TotalClaimAmount}</p>
                    <p><strong>Total Amount Spent:</strong> {selectedApply.TotalAmountSpent}</p>
                    <p><strong>Examination Date:</strong> {selectedApply.ExaminationDate}</p>
                    <p><strong>Remark:</strong> {selectedApply.Remark}</p>
                </div>
            )}
            {listInfo.length > 0 && (
                <div style={{borderTop: '1px solid #ccc', paddingTop: '20px'}}>
                    {listInfo.map((item: any, index: number) => (
                        <div key={index} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <p><strong>Title:</strong> {item.Title}</p>
                                <p><strong>Description:</strong> {item.Description}</p>
                                {/*<p><strong>Rejection Reason:</strong> {item.RejectionReason}</p>*/}
                            </div>
                            <Image style={{width: "100px", height: "100px"}}
                                   src={`data:image/jpeg;base64, ${item.FileContent}`}/>
                        </div>
                    ))}
                </div>
            )}
        </Form>
    </Modal></>)
}

export default ProcessPage
