import {Button, Card, Image, message, Modal, Popover} from "antd";
import React, {useEffect, useState} from "react";
import {create, del, listAll} from "../api/cert/cert";
import CreateCertForm from "./CreateCertForm";
import HTMLPreview from "./HTMLPreview";
import { getDetail} from "../api/cert/courseCertClaim";
import ApproveResultPage from "./com/ApproveResultPage";
import ApplyCertPage from "./com/ApplyCertPage";
import ApproveProcessPage from "./com/ApproveProcessPage";
import Icon from "antd/es/icon";
import applyIcon from "../assert/apply.svg";
import deatilcon from "../assert/deatil.svg";
import {DeleteOutlined} from "@ant-design/icons";

export const IndexContaniner = (props: any) => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const [selectedCourseID, setSelectedCourseID] = useState<string | null>(null); // State to store selected course ID
    const [userID, setUserID] = useState<string | null>(null); // State to store selected course ID
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedApply, setSelectedApply] = useState<any>(null);

    const [listInfo, setListInfo] = useState<any[]>([]); // State to store uploaded files


    useEffect(() => {
        getListAll();
        const role = localStorage.getItem("UserRole");
        setUserRole(role);
        setUserID(localStorage.getItem("UserID"))
    }, []);

    const getListAll = async () => {
        const res: any = await listAll();
        setCardInfoList(res["data"]);
    };


    const handleDelete = async (item: any) => {
        console.log("Deleting item with item:", item);
        const res: any = await del(item);
        if (res['code'] === '00000') {
            getListAll();
            message.info('del success')
        }
    };


    const handleShowMyApply = async (apply: any) => {

        const param = {
            CourseAndCertificationID: apply.ID,
            UserID: userID
        }
        const res: any = await getDetail(param)
        if (res['code'] === '00000' && res['data']) {

            const resData = {
                TotalAmountSpent: res.data.TotalAmountSpent,
                TotalClaimAmount: res.data.TotalClaimAmount,
                Remark: res.data.Remark,
                ExaminationDate: res.data.ExaminationDate,
                Status: res.data.Status,
            }
            setListInfo(res['data']['documentList'])
            setSelectedApply(resData);
           if (res.data.TotalAmountSpent){
               setDetailModalVisible(true);
           }else {
               message.warning('Apply Record is Empty Please Apply')
           }
        } else {
            message.warning("apply is empty")
        }

    };


    function getUserId() {
        const value = localStorage.getItem("UserID");
        return value ? value : '';
    }

    function allowApprove() {
        return ["teacher", 'SIT', 'NYP', 'IMDA', 'Account'].includes(userRole as string)
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
                                    style={{height: 400, objectFit: "cover"}}/>}
                    >
                        <Card.Meta
                            title={
                                <>
                                    <strong>{item["TitleOfCertification"]}</strong><br />
                                    <span>{"Provider: " + item["NameOfTrainingProvider"]}</span><br />
                                    <span>{"Course Start: " + item["CourseStart"]}</span><br />
                                    <span>{"Course End: " + item["CourseEnd"]}</span><br />
                                    <span>{"Submission Start: " + item["SubmissionStartDate"]}</span><br />
                                    <span>{"Submission End: " + item["SubmissionEndDate"]}</span>
                                </>
                            }
                            />
                        <div style={{marginBottom: "10px", marginTop: "15px",display:'inline-block'}}>
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
                                <img style={{height:'35px',cursor:'pointer'}} src={deatilcon}/>
                            </Popover>
                        </div>
                        {userRole === "student" && (
                            <>
                                <div style={{display:"flex"}}>
                                    <img style={{height:'35px',cursor:'pointer'}} src={applyIcon} onClick={() => {
                                        handleShowMyApply(item)
                                    }}></img>
                                    <ApplyCertPage selectedCourseID={item.ID}/>
                                    <ApproveResultPage UserId={getUserId()} CourseAndCertificationID={item.ID}/></div>
                            </>
                        )} {allowApprove() && (
                        <>
                            <ApproveProcessPage CourseAndCertificationID={item.ID}/>
                        </>
                    )}
                        {userRole === "admin" && (
                            <Button
                                icon={<DeleteOutlined />}
                                style={{position: "absolute", top: 0, right: 0}}
                                onClick={() => handleDelete(item)}
                                type={"primary"}
                            />
                        )}
                    </Card>
                ))}
                <CreateCertForm
                    onCancel={() => {
                        setIsModalOpen(false);
                    }}
                    onCreate={async (values) => {
                        const res: any = await create(values);
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
                    className="modal-content" // Add this className
                >
                    {selectedApply && (
                        <div style={{padding: "20px"}}>
                            <p><strong>Total Claim Amount:</strong> {selectedApply.TotalClaimAmount}</p>
                            <p><strong>Total Amount Spent:</strong> {selectedApply.TotalAmountSpent}</p>
                            <p><strong>Examination Date:</strong> {selectedApply.ExaminationDate}</p>
                            <p><strong>Remark:</strong> {selectedApply.Remark}</p>
                            <h2><strong>Status:</strong> {selectedApply.Status}</h2>
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
                </Modal>
            </div>
        </div>
    );
};
