import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { useSelector } from "react-redux";
import { Dropdown, Menu } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { RootState } from "../store/store";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.user;

  const handleMenuClick = (e: any) => {
    if (e.key === "logout") {
      logout();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="account" icon={<UserOutlined />}>
        My Account
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-md p-4 flex flex-col md:flex-row items-center justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
        <Link to="/" className="flex-shrink-0">
          <img
            src="https://via.placeholder.com/100x50"
            alt="Logo"
            className="h-10"
          />
        </Link>
        <div className="flex items-center ml-auto md:hidden">
          {isAuthenticated && user && (
            <img
              src={user.image_url || "https://via.placeholder.com/40x40"}
              alt={user.display_name}
              className="h-10 w-10 rounded-full ml-4"
            />
          )}
        </div>
      </div>

      <div className="flex items-center w-full md:w-auto">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md p-2 flex-1 min-w-[200px] md:w-64 lg:w-80"
        />
        {isAuthenticated && user && (
          <div className="hidden md:flex items-center ml-4 space-x-4">
            <img
              src={user.image_url || "https://via.placeholder.com/40x40"}
              alt={user.display_name}
              className="h-10 w-10 rounded-full"
            />
            <span className="ml-2 font-semibold">{user.display_name}</span>
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="p-2 cursor-pointer">
                <SettingOutlined className="text-xl" />
              </div>
            </Dropdown>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;