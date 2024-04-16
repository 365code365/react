import {Button, Card, message, Modal, Popover, Form, Input, DatePicker, Select} from "antd";
import {useEffect, useState} from "react";
import {create, del, listAll} from "../api/cert/cert";
import CreateCertForm from "./CreateCertForm";
import HTMLPreview from "./HTMLPreview";
import {createApply, getDetail, getListById, updateCertClaim} from "../api/cert/courseCertClaim";
import ApprovePage from "./com/ApprovePage";
import {UNSAFE_useRouteId} from "react-router-dom";
import ApplyCertPage from "./com/ApplyCertPage";

export const IndexContaniner = (props: any) => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const [selectedCourseID, setSelectedCourseID] = useState<string | null>(null); // State to store selected course ID
    const [userID, setUserID] = useState<string | null>(null); // State to store selected course ID
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedApply, setSelectedApply] = useState<any>(null);

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


    const handleShowMyApply = async (apply: any) => {

        let param = {
            CourseAndCertificationID: apply.ID,
            UserID: userID
        }
        let res: any = await getDetail(param)
        if (res['code'] === '00000' && res['data']) {

            let resData = {
                TotalAmountSpent: res.data.TotalAmountSpent,
                TotalClaimAmount: res.data.TotalClaimAmount,
                Remark: res.data.Remark,
                ExaminationDate: res.data.ExaminationDate,
            }
            setSelectedApply(resData);
            setDetailModalVisible(true);
        } else {
            message.warning("apply is empty")
        }

    };


    function getUserId() {
        let value = localStorage.getItem("UserID");
        return value ? value : '';
    }

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
                {cardInfoList.map((item: any) => (
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
                                <Button type="primary" onClick={() => {
                                    handleShowMyApply(item)
                                }} style={{marginRight: "10px"}}>
                                    Show My Apply
                                </Button>
                                <ApplyCertPage selectedCourseID={item.ID}/>
                                <ApprovePage UserId={getUserId()} CourseAndCertificationID={item.ID}/>
                            </>
                        )} {userRole === "teacher" && (
                        <>

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
                    title="Apply Details"
                    visible={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={null}
                >
                    {selectedApply && (
                        <div style={{padding: "20px"}}>
                            <p><strong>Total Claim Amount:</strong> {selectedApply.TotalClaimAmount}</p>
                            <p><strong>Total Amount Spent:</strong> {selectedApply.TotalAmountSpent}</p>
                            <p><strong>Examination Date:</strong> {selectedApply.ExaminationDate}</p>
                            <p><strong>Remark:</strong> {selectedApply.Remark}</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};
