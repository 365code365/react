import React, {useState} from 'react';
import {Form, Input, Button, Typography, Row, Col, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import {register} from "../api/loginApi";

const {Title} = Typography;

const RegisterPage: React.FC = () => {

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')


    const onFinish = async (values: any) => {

        if (password.length < 8) {
            messageApi.warning('The password length must be greater than eight characters.')
            return
        }

        if (password !== rePassword) {
            messageApi.warning('The two passwords do not match')
            return
        }

        let registerForm = {
            FullName: username,
            PasswordHash: password
        }
        let res: any = await register(registerForm)
        console.log('res', res)
        if (res['code'] === '00000') {
            //save local storage
            localStorage.setItem("token", res.data.token)
            navigate("/login")
        } else {
            messageApi.warning('register fail ' + res['message']);
        }
        console.log('Received values:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const validatePasswordConfirmation = ({getFieldValue}: any) => ({
        validator(_: any, value: any) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

    return (
        <>
            {contextHolder}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(to bottom right, #667db6, #0082c8, #0082c8, #667db6)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <Row justify="center" align="middle" style={{width: '100%', padding: '20px'}}>
                    <Col xs={24} sm={16} md={12} lg={8}>
                        <Form
                            name="register"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            requiredMark={true}
                            style={{background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '8px'}}
                        >
                            <Form.Item>
                                <Title level={2} style={{textAlign: 'center'}}>Register</Title>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="email"
                                rules={[{required: true, message: 'Please input your email!'}]}
                            >
                                <Input onChange={(e => setUserName(e.target.value))} placeholder={'input email'}
                                       prefix={<UserOutlined/>}/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{required: true, message: 'Please input your password!'}]}
                            >
                                <Input.Password onChange={(e => setPassword(e.target.value))}
                                                placeholder={'input password'} prefix={<LockOutlined/>}/>
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                label="Confirm Password"
                                dependencies={['password']}
                                rules={[
                                    {required: true, message: 'Please confirm your password!'},
                                    validatePasswordConfirmation,
                                ]}
                            >
                                <Input.Password onChange={(e => setRePassword(e.target.value))}
                                                placeholder={'repeat input password'} prefix={<LockOutlined/>}/>
                            </Form.Item>
                            <Form.Item style={{textAlign: 'center'}}>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Form.Item>
                            <Form.Item style={{textAlign: 'center'}}>
                                <Link to="/login">Back to Login</Link>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default RegisterPage;
