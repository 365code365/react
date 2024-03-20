import {Button, Card, Modal, Popover, Steps} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import HTMLPreview from "./HTMLPreview";
import CreatCert from "./CreateCertForm";
import CreateCertForm from "./CreateCertForm";


const {Step} = Steps;
export const CardBox = (props: any) => {


    const desc = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>Title</title>\n" +
        "</head>\n" +
        "<body>\n" +
        " <div>sss</div>\n" +
        "<strong>assaas</strong>\n" +
        "</body>\n" +
        "</html>";


    const [cardInfoList, setCardInfoList] = useState([
        {
            id: 1,
            title: 'Card 1',
            desc: desc,
            image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
            currentStep: 0,
            currentStepDesc: "waiting apply"
        },
        {
            id: 2,
            title: 'Card 1',
            desc: desc,
            image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
            currentStep: 1,
            currentStepDesc: "applying"
        },

        {
            id: 3,
            title: 'Card 1',
            desc: desc,
            image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
            currentStep: 0,
            currentStepDesc: "waiting apply"
        },

        {
            id: 4,
            title: 'Card 1',
            desc: desc,
            image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
            currentStep: 2,
            currentStepDesc: "waiting apply"
        },

    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);


    const [isAdmin, setIsAdmin] = useState(true)

    const [isTeacher, setIsTeacher] = useState(true)

    const [isStudent, setIsStudent] = useState(true)


    console.log('props', props)
    return (<div>
        <div>
            <Button onClick={() => {
                setIsModalOpen(true)
            }} style={{marginLeft: '10px', marginTop: '10px'}} type={'primary'}> 创建一个证书</Button>
        </div>
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px'
        }}>

            {cardInfoList.map((item) => (
                <Card
                    style={{maxWidth: 400, margin: '10px', border: '0.5px solid red'}}
                    cover={<img alt="Applying" src={item.image} style={{height: 300}}/>}
                >
                    <Card.Meta title={<strong>{item.currentStepDesc}</strong>}/>
                    <Steps size="small" status="error" current={item.currentStep} style={{marginTop: 20}}
                           items={[
                               {
                                   title: 'Finished',
                               },
                               {
                                   title: 'In Progress',
                               },
                               {
                                   title: 'Waiting',
                               },
                           ]}
                    />
                    <div style={{marginBottom: '10px'}}>
                        <Popover placement="top" trigger="click"
                                 content={<div
                                     style={{width: '300px', maxHeight: '300px', textWrap: 'wrap', overflowY: 'auto'}}>
                                     <HTMLPreview htmlContent={item.desc}/></div>}>
                            <a>certificate desc</a>
                        </Popover>
                    </div>
                    <div>
                        <Popover content={<p>display reject reason</p>} trigger="click">
                            <a style={{color: '#095672'}} type={"primary"}>show result</a>
                        </Popover>
                    </div>
                    <Button type="primary">apply</Button>
                    <Button style={{marginLeft: '10px', marginTop: '10px'}} type={'primary'}> 审批证书</Button>
                </Card>

            ))}
            <CreateCertForm onCancel={() => {
                setIsModalOpen(false)
            }} onCreate={(values) => {
                console.log('values', values)
            }} key={'11'} visible={isModalOpen}/>
        </div>

    </div>)
}