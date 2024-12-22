import React, { useState } from "react";
import {
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  GiftOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import "./AdminSidebar.css"; // Import ไฟล์ CSS

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("DASHBOARD", "dashboard", <DashboardOutlined style={{ fontSize: "30px" }} />),
  getItem("EMPLOYEE", "employee", <UserOutlined style={{ fontSize: "30px" }} />),
  getItem("MEMBER", "members", <TeamOutlined style={{ fontSize: "30px" }} />),
  getItem("DRIVER", "drivers", <IdcardOutlined style={{ fontSize: "30px" }} />),
  getItem("VEHICLE", "vehicle", <CarOutlined style={{ fontSize: "30px" }} />),
  getItem("TRAINING", "training", <FundProjectionScreenOutlined style={{ fontSize: "30px" }} />),
  getItem("PROMOTION", "promotion", <GiftOutlined style={{ fontSize: "30px" }} />),
  getItem("Log out", "logout", <LogoutOutlined style={{ fontSize: "30px", color: "#ff4d4f" }} />),
];

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      collapsedWidth={90}
      className="sider" // ใช้ className แทนการเขียน style inline
    >
      {/* Logo Section */}
      <div className={`logo ${collapsed ? "collapsed" : ""}`}>
        <div
          className={`logo-circle ${collapsed ? "collapsed" : ""}`}
        />
        {!collapsed && <span>username admin</span>}
      </div>

      {/* Menu Section */}
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        className="menu"
        items={items.map((item) => ({
          ...item,
          className: `menu-item ${item.key === "logout" ? "logout" : "default"}`,
        }))}
      />
    </Sider>
  );
};

export default AdminSidebar;
