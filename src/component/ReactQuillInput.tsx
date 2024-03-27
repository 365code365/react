import React, { useState } from "react";
import {Modal, Button, Form} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateCertForm: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editorHtml, setEditorHtml] = useState("");

    const handleOk = () => {
        // confirm btn
        setIsModalVisible(false);

    };

    const handleCancel = () => {
        //  cancel btn
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
