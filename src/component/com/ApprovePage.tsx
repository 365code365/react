import React, {useState, useEffect} from "react";
import {Button, Modal, Steps} from "antd";
import {getDetail} from "../../api/cert/courseCertClaim";
import processIcon from "../../assert/process.svg";

const {Step} = Steps;

interface StepData {
    title: string;
    description: string;
    status?: "wait" | "process" | "finish" | "error"; // Added status type
}

interface ApprovePageProps {
    UserId: string;
    CourseAndCertificationID: string;
}

interface StepModel {
    aproveRole: string
    order: number
    desc: string
    status?: "wait" | "process" | "finish" | "error"; // Added status type
}

const ApprovePage: React.FC<ApprovePageProps> = (props: ApprovePageProps) => {
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [stepsData, setStepsData] = useState<StepData[]>([]);
    const [remark, setRemark] = useState("");


    const [approvalProcess, setApprovalProcess] = useState<StepModel[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);


    async function getProcess() {
        let paramBody = {
            UserID: props.UserId,
            CourseAndCertificationID: props.CourseAndCertificationID
        };
        let res: any = await getDetail(paramBody);

        let data = res['data'];

        if (data) {
            console.log('res',res)

            const applyRuleJson = JSON.parse(res.data.applyRule);
            console.log('ruleRes', applyRuleJson)

            for (let i = 0; i < applyRuleJson.length; i++) {
                if (applyRuleJson[i].status !== 'waiting') {
                    setCurrentStep(parseInt(applyRuleJson[i].order))
                    break
                }
            }

            setApprovalProcess(applyRuleJson)

            setRemark(data.Remark);
        }
    }

    async function showProcess() {
        setShowProgressBar(true);
        setShowModal(true);
        getProcess();
    }

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <img style={{height: '35px', cursor: 'pointer'}} src={processIcon}
                 onClick={() => showProcess()}/>
            <Modal width={'1000px'}
                   title="My Process"
                   visible={showModal}
                   onCancel={handleModalCancel}
                   footer={null}
            >
                {showProgressBar && (
                    <div style={{marginTop: '20px'}}>
                        <Steps
                            current={currentStep}>
                            {approvalProcess.map((step, index) => (
                                <Step key={index} title={step.aproveRole} description={step.desc}
                                      status={step.status}/>
                            ))}
                        </Steps>
                    </div>
                )}
                <div style={{marginTop: '20px'}}>
                    <label style={{fontWeight: 'bold'}}>Remark:</label>
                    <div style={{marginTop: '5px'}}>{remark}</div>
                </div>
            </Modal>
        </>
    );
}

export default ApprovePage;
