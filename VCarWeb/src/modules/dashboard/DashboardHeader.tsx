import { Avatar, Badge, Button, GetProps, Input, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { useAuth } from "../../contexts/auth-context";
import LanguageSelector from "../../components/LanguageSelector";
import { BellOutlined } from "@ant-design/icons";
import { DEFAULT_AVATAR } from "../../config/apiConfig";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const DashboardHeader = () => {
    const { t } = useTranslation();
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    const { isLogged } = useAuth();
    console.log("DashboardHeader ~ isLogged:", isLogged)
    return (
        <Header className="flex items-center justify-between shadow-md bg-lite">
            <div className="flex items-center justify-center gap-x-5">
                <Link to={"/"} className="flex items-center justify-center">
                    <Typography.Text className="text-4xl font-bold text-center cursor-pointer text-primary-default">
                        VCAR
                    </Typography.Text>
                </Link>
                <Search
                    placeholder="Search car..."
                    onSearch={onSearch}
                    className="flex-1 w-full min-w-[300px]"
                />
            </div>
            <div className="flex items-center justify-center gap-x-2">
                <LanguageSelector></LanguageSelector>
                {isLogged ? <div className="flex items-center justify-center gap-x-5">
                    <Badge showZero count={0} size="default">
                        <BellOutlined className="text-xl" />
                    </Badge>
                    <Avatar
                        size={"large"}
                        src={DEFAULT_AVATAR}
                        className="cursor-pointer"
                    ></Avatar>
                </div> : <div>
                    <Button type="link" href="/signin">{t("login")}</Button>
                    <Button type="primary" href="/signup">{t("signUp")}</Button>
                </div>}
            </div>
        </Header>
    );
};

export default DashboardHeader;
