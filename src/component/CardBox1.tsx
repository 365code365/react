import {Button, Card, Popover, Steps} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import React from "react";


const {Step} = Steps;
export const CardBox1 = (props: any) => {
    console.log('props', props)
    return (<div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#831414',
        padding: '20px'
    }}>
        <Card
            style={{maxWidth: 400, margin: '10px'}}
            cover={<img alt="Applying" src="/path/to/applying-image.jpg" style={{height: 200}}/>}
        >
            <Card.Meta title={<strong>Applying</strong>}/>
            <Steps current={0} style={{marginTop: 20}}>
                <Step title="Step 1" icon={<LoadingOutlined/>}/>
                <Step title="Step 2" icon={<LoadingOutlined/>}/>
                <Step title="Step 3" icon={<LoadingOutlined/>}/>
            </Steps>
            <div style={{marginBottom: '10px'}}>
                <Popover content={"content"} title="Title">
                    <Button type="primary">apply</Button>
                </Popover>
            </div>
            <div>
                <Popover content={<p>display reject reason</p>} trigger="click">
                    <Button type={"primary"}>display reject reason</Button>
                </Popover>
            </div>
        </Card>
        <Card
            style={{maxWidth: 400, margin: '10px'}}
            cover={<img alt="Under Review" src="/path/to/under-review-image.jpg" style={{height: 200}}/>}
        >
            <Card.Meta title={<strong>Under Review</strong>}/>
            <Steps current={1} style={{marginTop: 20}}>
                <Step title="Step 1" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 2" icon={<LoadingOutlined/>}/>
                <Step title="Step 3" icon={<LoadingOutlined/>}/>
            </Steps>
        </Card>
        <Card
            style={{maxWidth: 400, margin: '10px'}}
            cover={<img alt="Approval Pending" src="/path/to/approval-pending-image.jpg"
                        style={{height: 200}}/>}
        >
            <Card.Meta title={<strong>Approval Pending</strong>}/>
            <Steps current={2} style={{marginTop: 20}}>
                <Step title="Step 1" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 2" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 3" icon={<LoadingOutlined/>}/>
            </Steps>
        </Card>
        <Card
            style={{maxWidth: 400, margin: '10px'}}
            cover={<img alt="Approved" src="/path/to/approved-image.jpg" style={{height: 200}}/>}
        >
            <Card.Meta title={<strong>Approved</strong>}/>
            <Steps current={3} style={{marginTop: 20}}>
                <Step title="Step 1" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 2" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 3" icon={<CheckCircleOutlined/>}/>
            </Steps>
        </Card>
        <Card
            style={{maxWidth: 400, margin: '10px'}}
            cover={<img alt="Approved" src="/path/to/approved-image.jpg" style={{height: 200}}/>}
        >
            <Card.Meta title={<strong>Approved</strong>}/>
            <Steps current={3} style={{marginTop: 20}}>
                <Step title="Step 1" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 2" icon={<CheckCircleOutlined/>}/>
                <Step title="Step 3" icon={<CheckCircleOutlined/>}/>
            </Steps>
        </Card>

    </div>)
}