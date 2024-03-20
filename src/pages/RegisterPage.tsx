import React from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
    const onFinish = (values: any) => {
        // 在这里可以执行注册逻辑
        console.log('Received values:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const validatePasswordConfirmation = ({ getFieldValue }: any) => ({
        validator(_: any, value: any) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

    return (
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
            <Row justify="center" align="middle" style={{ width: '100%', padding: '20px' }}>
                <Col xs={24} sm={16} md={12} lg={8}>
                    <Form
                        name="register"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        requiredMark={true}
                        style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '8px' }}
                    >
                        <Form.Item>
                            <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
                        </Form.Item>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                validatePasswordConfirmation,
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Link to="/login">Back to Login</Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;