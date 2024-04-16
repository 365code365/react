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

    useEffect(() => {
        // Fetch data and update stepsData here, you might need to adjust this according to your data structure
        const fetchData = async () => {
            let paramBody = {
                UserID: props.UserId,
                CourseAndCertificationID: props.CourseAndCertificationID
            };
            let res: any = await getDetail(paramBody);
            // Assuming res contains an array of steps data
            let status = res['status'];
            let arr = [
                {title: 'Submit', description: 'Submit'},
                {title: 'Pending', description: 'Pending'},
                {title: 'Reject', description: 'Reject'},
                {title: 'Finish', description: 'Finish'}]

           // Remove "Finish" if status is "Reject"
            if (status === 'Reject') {
                arr = arr.filter(item => item.title !== 'Finish');
            }

            // Remove "Reject" if status is "Finish"
            if (status === 'Finish') {
                arr = arr.filter(item => item.title !== 'Reject');
            }
            setStepsData(arr);
        };

        fetchData();
    }, [props.UserId, props.CourseAndCertificationID]);

    async function showProcess() {
        setShowProgressBar(true);
        setShowModal(true);
    }

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <div>
                <Button onClick={showProcess} style={{marginTop: '10px'}} type={'primary'}>Show my process</Button>
            </div>
            <Modal
                title="My Process"
                visible={showModal}
                onCancel={handleModalCancel}
                footer={null}
            >
                {showProgressBar && (
                    <div style={{marginTop: '20px'}}>
                        <Steps current={stepsData.length - 1}>
                            {stepsData.map((step, index) => (
                                <Step key={index} title={step.title} description={step.description}/>
                            ))}
                        </Steps>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default ApprovePage;
