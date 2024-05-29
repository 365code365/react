import React, {useEffect, useState} from "react";
import {Button, Form, Image, Input, message, Modal, Select, Steps} from "antd";
import {getDetail, getGradeProcess, getListById, updateCertClaim} from "../../api/cert/courseCertClaim";

import processIcon from "../../assert/process.svg";
import {getGradeList} from "../../api/loginApi";

const {Step} = Steps;


interface ProcessPageProps {
    CourseAndCertificationID: string
}

interface StepModel {
    aproveRole: string
    aproveRoleName: string
    order: number
    desc: string
    status?: "wait" | "process" | "finish" | "error"; // Added status type
}

const ApproveProcessPage: React.FC<ProcessPageProps> = (props: ProcessPageProps) => {
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [applyForm] = Form.useForm();

    const [listInfo, setListInfo] = useState<any[]>([]); // State to store uploaded files

    const [applyListOptions, setApplyListOptions] = useState<any>([]);

    const [selectedApply, setSelectedApply] = useState<any>(null);

    const [approveStatus, setApproveStatus] = useState<any>(null);
    const [approvalProcess, setApprovalProcess] = useState<StepModel[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);


    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        gradeList()
    }, []);


    const getApplyListAll = async (grade: string) => {

        const param = {
            CourseAndCertificationID: props.CourseAndCertificationID,
            grade: grade
        }
        const res: any = await getListById(param);
        setApplyListOptions(res["data"])

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
        data['role'] = localStorage.getItem("UserRole")
        console.log('values', data)
        const res: any = await updateCertClaim(data)
        if (res['code'] === '00000') {
            message.info('submit success')
            setApproveModalVisible(false)
        } else {
            message.warning(res['message'])
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


    const setStep = (applyRuleJson) => {
        for (let i = 0; i < applyRuleJson.length; i++) {
            if (applyRuleJson[i].status !== 'waiting') {
                setCurrentStep(parseInt(applyRuleJson[i].order))
                break
            }
        }

        setApprovalProcess(applyRuleJson)
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
            setListInfo(res.data.documentList)
            const applyRuleJson = JSON.parse(res.data.applyRule);
            console.log('ruleRes', applyRuleJson)
            setStep(applyRuleJson);

        } else {
            message.warning("apply is empty")
        }

    };

    const gradeList = async () => {
        try {
            const res: any = await getGradeList();
            const arr = res.data.map((item: any) => ({
                value: item.Grade,
                label: item.Grade,
            }));
            setOptions(arr);
        } catch (error) {
            message.error('Failed to fetch grade list');
        }
    };


    function allowApprove(role: string) {
        return ['SIT', 'NYP', 'IMDA', 'Account'].includes(role)
    }

    const selectStudentByGrade = () => {
        return (<>
            <Form.Item
                name="grade"
                label="Select grade"
                rules={[{required: true, message: "Please select the grade."}]}
            >
                <Select
                    placeholder="Select an option"
                    onChange={async (e) => {
                        getApplyListAll(e)
                    }}
                    options={options}
                />
            </Form.Item>
            <Form.Item
                name="UserID"
                label="UserID"
                rules={[{required: true, message: 'Please select UserID'}]}
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
        </>)
    }

    const onlySelectGrade = () => {
        return <Form.Item
            name="grade"
            label="Select grade"
            rules={[{required: true, message: "Please select the grade."}]}
        >
            <Select
                placeholder="Select an option"
                options={options}
                onChange={async (e) => {
                    const param = {
                        grade: e
                    }
                    const res: any = await getGradeProcess(param)
                    if (res['code'] === '00000') {
                        console.log('ssss', JSON.parse(res.data.applyRule))
                        setStep(JSON.parse(res.data.applyRule))
                    } else {
                        setStep([])
                        message.warning(res.message)
                    }
                }}
            />
        </Form.Item>;
    }

    const getProcess = () => {
        return <Form.Item>
            <Steps
                current={currentStep}>
                {approvalProcess.map((step, index) => (
                    <Step key={index} title={step.aproveRoleName} description={step.desc}
                          status={step.status}/>
                ))}
            </Steps>
        </Form.Item>;
    }

    const showDetail = () => {
        return <>
            {selectedApply && (
                <div style={{padding: "20px"}}>
                    <p><strong>Total Claim Amount:</strong> {selectedApply.TotalClaimAmount}</p>
                    <p><strong>Total Amount Spent:</strong> {selectedApply.TotalAmountSpent}</p>
                    <p><strong>Examination Date:</strong> {selectedApply.ExaminationDate}</p>
                    <p><strong>Remark:</strong> {selectedApply.Remark}</p>
                </div>
            )}
            {listInfo.length > 0 && !allowApprove(localStorage.getItem("UserRole")) && (
                <div style={{borderTop: '1px solid #ccc', paddingTop: '20px'}}>
                    {listInfo.map((item: any, index: number) => (
                        <div key={index} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <p><strong>Title:</strong> {item.Title}</p>
                                <p><strong>Description:</strong> {item.Description}</p>
                            </div>
                            <Image style={{width: "100px", height: "100px"}}
                                   src={`data:image/jpeg;base64, ${item.FileContent}`}/>
                        </div>
                    ))}
                </div>
            )}
        </>;
    }

    return (<>
        <img style={{height: '35px', cursor: 'pointer'}} src={processIcon} onClick={() => {
            // getApplyListAll()
            handleApproval()
        }}/>
        <Modal
            width={900}
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

                {getProcess()}
                {!allowApprove(localStorage.getItem("UserRole")) && (selectStudentByGrade())}
                {allowApprove(localStorage.getItem("UserRole")) && onlySelectGrade()}

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
                            {label: 'Pass', value: 'Pass'},
                            {label: 'Reject', value: 'Reject'},
                        ]}/>
                </Form.Item>
                <Form.Item
                    name="Remark"
                    label="Remark"
                >
                    <Input.TextArea/>
                </Form.Item>
                {showDetail()}
            </Form>
        </Modal></>)
}

export default ApproveProcessPage
