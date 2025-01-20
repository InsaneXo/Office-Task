import React, { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoBagCheck, IoLogOut } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import "./style.css";
import api_services from "../../services/api_services";
import { useDispatch } from "react-redux";
import { authAction } from "../../redux/reducers/auth";
import { CustomDialog } from "../../components/Dialog/CustomDialog";

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const adminTab = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LuLayoutDashboard size={25} />,
    },
    {
      name: "Products Management",
      path: "/admin/products",
      icon: <IoBagCheck size={25} />,
    },
    {
      name: "Users Management",
      path: "/admin/users",
      icon: <FaUserCheck size={25} />,
    },
  ];
  const location = useLocation();

  // Track hover state for each tab
  const [hoveredTab, setHoveredTab] = useState(null);
  const dispatch = useDispatch();

  const logouthandler = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      await api_services.adminLogout(token);
      setOpen(false);
      dispatch(authAction.isAdminNotExists());
    } catch (error) {
      dispatch(authAction.isAdminExists());
    }
  };

  return (
    <>
      <div className="admin-layout-container">
        <div className="side-bar">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <MdAdminPanelSettings size={40} color="orange" />
              <h3 style={{ color: "orange" }}>Admin Panel</h3>
            </div>

            {adminTab.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                style={{
                  height: 60,
                  width: "100%",
                  backgroundColor:
                    location.pathname === item.path
                      ? "#1A1A1D"
                      : hoveredTab === index
                      ? "#333"
                      : "transparent",
                  color:
                    location.pathname === item.path || hoveredTab === index
                      ? "white"
                      : "black",
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0px 20px",
                  cursor: "pointer",
                  marginBottom: 3,
                  textDecoration: "none",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={() => setHoveredTab(index)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {item.icon}
                <p style={{ fontSize: 15 }}>{item.name}</p>
              </Link>
            ))}
          </div>

          <div
            style={{
              height: 60,
              width: "100%",
              color: "white",
              borderRadius: 50,
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#f72c5b",
              padding: "0px 20px",
              cursor: "pointer",
              marginBottom: 3,
            }}
            onClick={() => setOpen(true)}
          >
            <IoLogOut size={25} />
            <p style={{ fontSize: 15 }}>LogOut</p>
          </div>
        </div>
        {children}
      </div>
      <CustomDialog
        dialogTitle={"Are you want to logout?"}
        open={open}
        setOpen={setOpen}
        handler={logouthandler}
      />
    </>
  );
};

export default AdminLayout;
