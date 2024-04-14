import {Button, Card, message, Modal, Popover, Form, Input, DatePicker} from "antd";
import {useEffect, useState} from "react";
import {create, del, listAll} from "../api/cert/cert";
import CreateCertForm from "./CreateCertForm";
import HTMLPreview from "./HTMLPreview";
import {createApply} from "../api/cert/courseCertClaim";

export const IndexContaniner = (props: any) => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [applyForm] = Form.useForm();
    const [selectedCourseID, setSelectedCourseID] = useState<string | null>(null); // State to store selected course ID
    const [userID, setUserID] = useState<string | null>(null); // State to store selected course ID

    useEffect(() => {
        getListAll();
        const role = localStorage.getItem("UserRole");
        setUserRole(role);
        setUserID(localStorage.getItem("UserID"))
    }, []);

    const getListAll = async () => {
        let res: any = await listAll();
        setCardInfoList(res["data"]);
    };

    const handleDelete = async (item: any) => {
        console.log("Deleting item with item:", item);
        let res: any = await del(item);
        if (res['code'] === '00000') {
            getListAll();
            message.info('del success')
        }
    };

    const handleApplyCert = (item: any) => {
        setSelectedCourseID(item.ID); // Set selected course ID
        setApplyModalVisible(true);
    };

    const handleApplyCancel = () => {
        setApplyModalVisible(false);
    };

    const handleApplySubmit = async (values: any) => {
        try {
            // Set CourseAndCertificationID in form values
            values.ExaminationDate = new Date(values.ExaminationDate);
            values.CourseAndCertificationID = selectedCourseID;
            values.UserID = userID
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

    return (
        <div>
            <div>
                {userRole === "admin" && (
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        style={{marginLeft: "10px", marginTop: "10px"}}
                        type={"primary"}
                    >
                        Create Certificate
                    </Button>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                {cardInfoList.map((item) => (
                    <Card
                        key={item['id']}
                        style={{
                            maxWidth: 400,
                            margin: "10px",
                            border: "1px solid #d9d9d9",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            position: "relative",
                        }}
                        cover={<img alt="Applying" src={item["CourseImage"]}
                                    style={{height: 300, objectFit: "cover"}}/>}
                    >
                        <Card.Meta title={<strong>{item["TitleOfCertification"]}</strong>}/>
                        <div style={{marginBottom: "10px", marginTop: "15px"}}>
                            <Popover
                                placement="top"
                                trigger="click"
                                content={
                                    <div
                                        style={{
                                            width: "300px",
                                            maxHeight: "300px",
                                            textWrap: "wrap",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <HTMLPreview htmlContent={item["CourseDesc"]}/>
                                    </div>
                                }
                            >
                                <Button type={"primary"}>Certificate desc</Button>
                            </Popover>
                        </div>
                        {userRole === "student" && (
                            <>
                                <Button type="primary" style={{marginRight: "10px"}}>
                                    Show My Apply
                                </Button>
                                <Button type="primary" onClick={() => handleApplyCert(item)}>Apply Cert</Button>
                            </>
                        )}
                        {userRole === "admin" && (
                            <Button
                                style={{position: "absolute", top: 0, right: 0}}
                                onClick={() => handleDelete(item)}
                                type={"primary"}
                            >
                                Delete
                            </Button>
                        )}
                    </Card>
                ))}
                <CreateCertForm
                    onCancel={() => {
                        setIsModalOpen(false);
                    }}
                    onCreate={async (values) => {
                        let res: any = await create(values);
                        if (res["code"] == "00000") {
                            getListAll();
                            setIsModalOpen(false);
                            message.info("create success");
                        } else {
                            message.info(res["message"]);
                        }
                    }}
                    key={"11"}
                    visible={isModalOpen}
                />
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
                        initialValues={{CourseAndCertificationID: selectedCourseID}} // Set initial value for CourseAndCertificationID
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
                            <DatePicker style={{width: "100%"}}  format="YYYY-MM-DD"/>
                        </Form.Item>
                        <Form.Item
                            name="Remark"
                            label="Remark"
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};
