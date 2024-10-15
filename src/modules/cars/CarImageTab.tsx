import { PlusOutlined } from "@ant-design/icons";
import { Form, Row, Upload } from "antd";
import { useTranslation } from "react-i18next";
// import { beforeUpload } from "../../utils";
import { UploadFile } from "antd/es/upload";
import { onPreview } from "../../utils";

const CarImageTab = ({ setScreenShot }: {
    setScreenShot: (screenShot: UploadFile[]) => void
}) => {
    const { t } = useTranslation();
    const handleChange = (info: { fileList: UploadFile[] }) => {
        setScreenShot(info.fileList);
    };
    return (
        <Row>
            <Form.Item
                name={"image_url"}
                label={t('car.image_url')}
                rules={[{ required: true, message: t('car.image_url.required') }]}
            >
                <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    // beforeUpload={(file, fileList) => beforeUpload(file, fileList, t)}
                    beforeUpload={() => false}
                    onChange={handleChange}
                    multiple={true}
                    onPreview={onPreview}
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
            </Form.Item>
        </Row>
    );
};

export default CarImageTab;