import { useTranslation } from "react-i18next";
import { Button, Form, FormProps, Input, Typography } from "antd";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { LOGIN } from "../store/auth/actions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAccessToken } from "../utils";
type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state: RootState) => state.auth);
  const accessToken = getAccessToken();

  const onFinish = (values: FieldType) => {
    dispatch({ type: LOGIN, payload: values });
    if (user && user.id && !error && !loading) {
      toast.success(t("loginSuccess"));
      navigate("/");
    } else {
      toast.error(t("loginFailed"));
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate])

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <LayoutAuthentication>
      <Form
        form={form}
        name="login-form"
        layout="vertical"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="bg-lite w-full max-w-[400px] p-4 rounded-lg shadow-md mx-auto"
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
          }}
        >
          {t("login")}
        </Typography.Title>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: t("require"),
            },
            {
              type: "email",
              message: t("emailInvalid"),
            },
          ]}
        >
          <Input placeholder={t("emailPlaceholder")} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: t("require"),
            },
            {
              min: 8,
              message: t("passwordInvalid"),
            },
          ]}
        >
          <Input.Password placeholder={t("passwordPlaceholder")} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            iconPosition={"end"}
          >
            {t("login")}
          </Button>
        </Form.Item>
        <Typography.Paragraph
          style={{
            textAlign: "center",
          }}
        >
          {t("dontHaveAccount")}{" "}
          <Button type="link" href="/signup">
            {t("signUp")}
          </Button>
        </Typography.Paragraph>
      </Form>
    </LayoutAuthentication>
  );
};

export default LoginPage;
