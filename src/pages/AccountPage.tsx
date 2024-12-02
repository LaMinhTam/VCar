import { CarOutlined, DeleteOutlined, DragOutlined, LockOutlined, LogoutOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Affix, Button, Col, Divider, Row, Typography } from "antd";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { saveAccessToken, saveRefreshToken, saveUser } from "../utils";
import { useAuth } from "../contexts/auth-context";
import ContractIcon from "../components/icons/ContractIcon";
import { useTranslation } from "react-i18next";
import RequiredAuthLayout from "../layouts/RequireAuthLayout";

const AccountPage = () => {
    const { t } = useTranslation();
    const tabs = [
        {
            key: "account",
            path: "/account",
            title: t("account.my_account"),
            icon: <UserOutlined className="text-xl" />,
        },
        // {
        //     key: "favorite",
        //     path: "/account/favorite",
        //     title: "Xe yêu thích",
        //     icon: <HeartOutlined className="text-xl" />,
        // },
        {
            key: "my-cars",
            path: "/account/my-cars",
            title: t("account.my_cars"),
            icon: <CarOutlined className="text-xl" />,
        },
        {
            key: "my-trips",
            path: "/account/my-trips",
            title: t("account.my_trips"),
            icon: <DragOutlined className="text-xl" />,
        },
        {
            key: "my-car-lessee",
            path: "/account/my-car-lessee",
            title: t("account.my_lessee"),
            icon: <ShoppingCartOutlined className="text-xl" />,
        },
        {
            key: "lessee-contract",
            path: "/account/lessee-contract",
            title: t("account.rent_contract"),
            icon: <ContractIcon className="text-xl" />,
        },
        {
            key: "lessor-contract",
            path: "/account/lessor-contract",
            title: t("account.rental_contract"),
            icon: <ContractIcon className="text-xl" />,
        },
        {
            key: "change-password",
            path: "/account/change-password",
            title: t("account.change_password"),
            icon: <LockOutlined className="text-xl" />,
        },
    ];
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const { setIsLogged } = useAuth();
    const handleLogout = () => {
        saveAccessToken("");
        saveRefreshToken("");
        saveUser("");
        setIsLogged(false);
        navigate("/");
    }

    return (
        <RequiredAuthLayout>
            <Row gutter={[24, 0]}>
                <Col span={6}>
                    <Row>
                        <Affix offsetTop={100}>
                            <Col span={24}>
                                <Typography.Title level={2}>{t("common.welcome")}</Typography.Title>
                            </Col>
                            <Divider className="m-0"></Divider>
                            {tabs.map((tab) => (
                                <Col span={24} key={tab.key} className={path === tab.path ? "border-r-[3px] border-r-primary-default" : ""}>
                                    <Link to={tab.path}>
                                        <Button
                                            type="text"
                                            className={`justify-start h-[56px] w-full font-medium text-[16px] ${path === tab.path ? "text-primary-default" : ""
                                                }`}
                                            icon={tab.icon}
                                        >
                                            {tab.title}
                                        </Button>
                                    </Link>
                                </Col>
                            ))}
                            <Divider className="m-0"></Divider>
                            <Col span={24}>
                                <Button type="text" danger className="justify-start h-[56px] w-full font-medium text-[16px]" icon={<DeleteOutlined className="text-xl" />}>{t("account.delete_account")}</Button>
                            </Col>
                            <Col span={24}>
                                <Button onClick={handleLogout} type="text" className="justify-start h-[56px] w-full font-medium text-[16px]" icon={<LogoutOutlined className="text-xl" />}>{t("account.logout")}</Button>
                            </Col>
                        </Affix>
                    </Row>
                </Col>
                <Col span={18} style={{ padding: 0 }}>
                    <Outlet />
                </Col>
            </Row>
        </RequiredAuthLayout>
    );
};

export default AccountPage;