import React, {useState, useEffect} from "react";
import {Button, Modal, Steps} from "antd";
import {getDetail} from "../../api/cert/courseCertClaim";

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

const ApprovePage: React.FC<ApprovePageProps> = (props: ApprovePageProps) => {
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [stepsData, setStepsData] = useState<StepData[]>([]);
    const [remark, setRemark] = useState("");

    async function getProcess() {
        let paramBody = {
            UserID: props.UserId,
            CourseAndCertificationID: props.CourseAndCertificationID
        };
        let res: any = await getDetail(paramBody);

        let data = res['data'];

        if (data) {
            let status = data.Status;

            let arr: StepData[] = [
                {title: 'Submit', description: 'Submit', status: 'finish'}, // Set initial status for the first step
                {title: 'Pending', description: 'Pending', status: 'wait'}, // Set initial status for the second step
                {title: 'Reject', description: 'Reject', status: 'wait'}, // Set initial status for the third step
                {title: 'Finish', description: 'Finish', status: 'wait'} // Set initial status for the fourth step
            ];

            switch (status) {
                case 'Reject':
                    arr[1].status = 'finish'; // Change status for the "Reject" step
                    arr[2].status = 'error'; // Change status for the "Reject" step
                    arr = arr.filter(item => item.title !== 'Finish');
                    break;
                case 'Pending':
                    arr[1].status = 'finish'; // Change status for the "Finish" step
                    arr[3].status = 'wait'; // Change status for the "Finish" step
                    arr = arr.filter(item => item.title !== 'Reject');
                    break;
                case 'Finish':
                    arr[1].status = 'finish'; // Change status for the "Finish" step
                    arr[3].status = 'finish'; // Change status for the "Finish" step
                    arr = arr.filter(item => item.title !== 'Reject');
                    break;
                default:
                    break;
            }

            setRemark(data.Remark);
            setStepsData(arr);
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
            <div>
                <Button size={'middle'} onClick={showProcess} style={{marginTop: '10px'}} type={'primary'}>Show my
                    process</Button>
            </div>
            <Modal
                title="My Process"
                visible={showModal}
                onCancel={handleModalCancel}
                footer={null}
            >
                {showProgressBar && (
                    <div style={{marginTop: '20px'}}>
                        <Steps
                            current={stepsData.findIndex(step => step.status === 'process' || step.status === 'finish')}>
                            {stepsData.map((step, index) => (
                                <Step key={index} title={step.title} description={step.description}
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
