import React, { useState } from "react";
import {Modal, Button, Form} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateCertForm: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editorHtml, setEditorHtml] = useState("");

    const handleOk = () => {
        // 处理确认按钮点击
        setIsModalVisible(false);
        // 编辑器内容可通过editorHtml进行处理
    };

    const handleCancel = () => {
        // 处理取消按钮点击
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create Certificate
            </Button>
            <Modal
                title="Create Certificate"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="Certificate Description">
                        <ReactQuill
                            theme="snow"
                            value={editorHtml}
                            onChange={setEditorHtml}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateCertForm;