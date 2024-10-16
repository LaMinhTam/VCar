import { PlusOutlined } from "@ant-design/icons";
import { Form, Row, Upload } from "antd";
import { UploadFile } from "antd/es/upload";
import { useTranslation } from "react-i18next";
import { onPreview } from "../../utils";

const CarImageTab = ({ screenShot, setScreenShot }: {
    screenShot: UploadFile[];
    setScreenShot: (screenShot: UploadFile[]) => void;
}) => {
    const { t } = useTranslation();

    const handleChange = (info: { fileList: UploadFile[] }) => {
        setScreenShot(info.fileList);
    };

    const handleRemove = (file: UploadFile) => {
        const newScreenShot = screenShot.filter(item => item.uid !== file.uid);
        setScreenShot(newScreenShot);
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
                    fileList={screenShot}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    beforeUpload={() => false}
                    onPreview={onPreview}
                    multiple={true}
                >
                    {screenShot?.length >= 8 ? null : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>
        </Row>
    );
};

export default CarImageTab;
