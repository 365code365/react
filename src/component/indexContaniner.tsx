import {Button, Card, message, Modal, Popover, Steps} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import ReactQuill from "react-quill";
import HTMLPreview from "./HTMLPreview";
import CreatCert from "./CreateCertForm";
import CreateCertForm from "./CreateCertForm";
import {create, listAll} from "../api/cert/cert";


const {Step} = Steps;
export const IndexContaniner = (props: any) => {


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
        // {
        //     id: 1,
        //     title: 'Card 1',
        //     desc: desc,
        //     image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
        //     currentStep: 0,
        //     currentStepDesc: "waiting apply"
        // },
        // {
        //     id: 2,
        //     title: 'Card 1',
        //     desc: desc,
        //     image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
        //     currentStep: 1,
        //     currentStepDesc: "applying"
        // },
        //
        // {
        //     id: 3,
        //     title: 'Card 1',
        //     desc: desc,
        //     image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
        //     currentStep: 0,
        //     currentStepDesc: "waiting apply"
        // },
        //
        // {
        //     id: 4,
        //     title: 'Card 1',
        //     desc: desc,
        //     image: 'https://th.bing.com/th/id/OIP.QC-Su_ie-QzKBtY74XNNIgHaJ-?rs=1&pid=ImgDetMain',
        //     currentStep: 2,
        //     currentStepDesc: "waiting apply"
        // },

    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        getListAll()
    }, []);

    const getListAll = async () => {
        let res: any = await listAll()
        setCardInfoList(res['data'])
    }


    console.log('props', props)
    return (<div>
        <div>
            <Button onClick={() => {
                setIsModalOpen(true)
            }} style={{marginLeft: '10px', marginTop: '10px'}} type={'primary'}> Create Certificate</Button>
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
                    cover={<img alt="Applying" src={item['CourseImage']} style={{height: 300}}/>}
                >
                    <Card.Meta title={<strong>{item['TitleOfCertification']}</strong>}/>
                    <div style={{marginBottom: '10px', marginTop: '15px'}}>
                        <Popover placement="top" trigger="click"
                                 content={<div
                                     style={{width: '300px', maxHeight: '300px', textWrap: 'wrap', overflowY: 'auto'}}>
                                     <HTMLPreview htmlContent={item['CourseDesc']}/></div>}>
                            <Button type={'primary'}>Certificate desc</Button>
                        </Popover>
                    </div>
                    <Button type="primary">Show My Apply</Button>
                    <Button style={{marginLeft: '10px', marginTop: '10px'}} type={'primary'}> Apply Cert</Button>
                </Card>

            ))}
            <CreateCertForm onCancel={() => {
                setIsModalOpen(false)
            }} onCreate={async (values) => {
                console.log('values', values)
                let res: any = await create(values)
                console.log('res', res)
                if (res['code'] == '00000') {
                    getListAll()
                    setIsModalOpen(false)
                    message.info("create success")
                } else {
                    message.info(res['message'])
                }
            }} key={'11'} visible={isModalOpen}/>
        </div>

    </div>)
}
