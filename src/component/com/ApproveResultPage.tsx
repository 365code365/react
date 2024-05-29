import React, {useState, useEffect} from "react";
import {Button, Image, Modal, Steps} from "antd";
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

const ApproveResultPage: React.FC<ApprovePageProps> = (props: ApprovePageProps) => {
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [remark, setRemark] = useState("");

    const [approvalProcess, setApprovalProcess] = useState<StepModel[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [listInfo, setListInfo] = useState<any[]>([]); // State to store uploaded files


    async function getProcess() {
        const paramBody = {
            UserID: props.UserId,
            CourseAndCertificationID: props.CourseAndCertificationID
        };
        const res: any = await getDetail(paramBody);

        const data = res['data'];

        if (data) {
            console.log('res', res)

            const applyRuleJson = JSON.parse(res.data.applyRule);
            console.log('ruleRes', applyRuleJson)

            for (let i = 0; i < applyRuleJson.length; i++) {
                if (applyRuleJson[i].status !== 'waiting') {
                    setCurrentStep(parseInt(applyRuleJson[i].order))
                    break
                }
            }

            setApprovalProcess(applyRuleJson)
            setListInfo(res.data.documentList)
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
                {listInfo.length > 0 && (
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
            </Modal>
        </>
    );
}

export default ApproveResultPage;
