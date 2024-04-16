import React, {useState, useEffect} from "react";
import {Button, Modal, Steps} from "antd";
import {getDetail} from "../api/cert/courseCertClaim";

const {Step} = Steps;

interface StepData {
    title: string;
    description: string;
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

        let arr = [
            {title: 'Submit', description: 'Submit'},
            {title: 'Pending', description: 'Pending'},
            {title: 'Reject', description: 'Reject'},
            {title: 'Finish', description: 'Finish'}]

        if (data) {
            let status = data.Status
            if (status === 'Reject') {
                arr = arr.filter(item => item.title !== 'Finish');
            }

            if (status === 'Finish') {
                arr = arr.filter(item => item.title !== 'Reject');
            }
            setRemark(data.Remark)
            setStepsData(arr);
        }
    }

    async function showProcess() {
        setShowProgressBar(true);
        setShowModal(true);
        getProcess()
    }

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <div>
                <Button size={'middle'} onClick={showProcess} style={{marginTop: '10px'}} type={'primary'}>Show my process</Button>
            </div>
            <Modal
                title="My Process"
                visible={showModal}
                onCancel={handleModalCancel}
                footer={null}
            >
                {showProgressBar && (
                    <div style={{marginTop: '20px'}}>
                        <Steps current={stepsData.length}>
                            {stepsData.map((step, index) => (
                                <Step key={index} title={step.title} description={step.description}/>
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
