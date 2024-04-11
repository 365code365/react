import {Button, Card, message, Modal, Popover, Steps} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import ReactQuill from "react-quill";
import HTMLPreview from "./HTMLPreview";
import CreateCertForm from "./CreateCertForm";
import {create, listAll} from "../api/cert/cert";

export const IndexContaniner = (props: any) => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null); // State to store user role

    useEffect(() => {
        getListAll();
        // Retrieve user role from localStorage
        const role = localStorage.getItem("UserRole");
        console.log('role', role)
        setUserRole(role);
    }, []);

    const getListAll = async () => {
        let res: any = await listAll();
        setCardInfoList(res["data"]);
    };

    const handleDelete = (id: string) => {
        // Implement delete functionality here
        console.log("Deleting item with ID:", id);
    };

    console.log("props", props);
    return (
        <div>
            <div>
                {userRole === "admin" && ( // Only show create certificate button for admin users
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        style={{marginLeft: "10px", marginTop: "10px"}}
                        type={"primary"}
                    >
                        {" "}
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
                        key={item['id']} // Assuming each card has a unique ID
                        style={{
                            maxWidth: 400,
                            margin: "10px",
                            border: "1px solid #d9d9d9",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            position: "relative", // Add position relative for delete button positioning
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
                        <Button type="primary">Show My Apply</Button>
                        {userRole === "admin" && ( // Only show delete button for admin users
                            <Button
                                style={{position: "absolute", top: 0, right: 0}} // Position the delete button
                                onClick={() => handleDelete(item['id'])} // Pass the item ID to the delete function
                                type={"primary"}
                            >
                                Delete
                            </Button>
                        )}
                        <Button style={{marginLeft: "10px", marginTop: "10px"}} type={"primary"}>
                            {" "}
                            Apply Cert
                        </Button>
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
            </div>
        </div>
    );
};
