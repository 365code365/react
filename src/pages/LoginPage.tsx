import {useState} from 'react';
import {Form, Input, Button, Checkbox, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {login} from "../api/loginApi";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values: any) => {
        setLoading(true);
        // login
        console.log('Received values:', values);
        setLoading(false);
    };


    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleLoginClick = async () => {
        // navigate('/home');
        let loginForm = {
            FullName: username,
            PasswordHash: password
        }
        let res: any = await login(loginForm)
        console.log('res', res)
        if (res['code'] === '00000') {
            //save local storage
            localStorage.setItem("token", res.data.token)
            navigate("/home")
        } else {
            messageApi.warning('log fail ' + res['message']);
        }
    };


    return (
        <>
            {contextHolder}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #667db6, #0082c8, #0082c8, #667db6)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}>
                <div style={{maxWidth: 300, padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                    <Form
                        name="loginForm"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your username!'}]}
                        >
                            <Input onChange={e => setUsername(e.target.value)} prefix={<UserOutlined/>}
                                   placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password onChange={e => setPassword(e.target.value)} prefix={<LockOutlined/>}
                                            placeholder="Password"/>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={handleLoginClick} type="primary" htmlType="submit" loading={loading} block>
                                Log in
                            </Button>
                        </Form.Item>
                        <div style={{textAlign: 'center'}}>
                            <Button onClick={handleRegisterClick} type="link">Register</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>

    );
};

export default LoginPage;
