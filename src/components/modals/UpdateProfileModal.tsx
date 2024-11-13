import { Button, Form, Input, message } from "antd";
import { updateProfile } from "../../store/profile/handlers";
import { getAccessToken, getUserInfoFromCookie, saveUserInfoToCookie } from "../../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface FieldType {
    display_name: string;
    phone_number: string;
}

const UpdateProfileModal = ({ setOpenUpdateProfileModal, refetchMe, setRefetchMe }: {
    setOpenUpdateProfileModal: (value: boolean) => void;
    refetchMe: boolean;
    setRefetchMe: (value: boolean) => void;
}) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const accessToken = getAccessToken();
    const userInfo = getUserInfoFromCookie()
    const onFinish = async (values: FieldType) => {
        setLoading(true);
        const response = await updateProfile(values);
        if (response?.success && response?.data) {
            saveUserInfoToCookie(response?.data, accessToken || '');
            message.success(t("msg.UPDATE_PROFILE_SUCCESS"));
            setOpenUpdateProfileModal(false);
            setLoading(false);
            setRefetchMe(!refetchMe);
        } else {
            message.error(t("msg.UPDATE_PROFILE_FAILED"));
            setLoading(false);
        }
    };
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                display_name: userInfo?.display_name || '',
                phone_number: userInfo?.phone_number || ''
            }}
        >
            <Form.Item<FieldType>
                label={t("account.my_account.display_name")}
                name="display_name"
                rules={[
                    { required: true, message: t("account.my_account.display_name.required") }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label={t("account.my_account.phoneNumber")}
                name="phone_number"
                rules={[
                    { required: true, message: t("account.my_account.phoneNumber.required") },
                    { pattern: /^[0-9]{10}$/, message: t("account.my_account.phoneNumber.invalid") }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full" loading={loading}>{t("common.update")}</Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateProfileModal;