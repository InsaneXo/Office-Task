import React from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import api_services from "../../services/api_services";
import { authAction } from "../../redux/reducers/auth";
import toast from "react-hot-toast";
import { setIsMenu } from "../../redux/reducers/misc";

const MenuBar = ({ toggleMenu }) => {
  const { isMenu } = useSelector((store) => store.misc);

  const dispatch = useDispatch();

  const menuItems = [
    {
      name: "Home",
    },
    {
      name: "About",
    },
    {
      name: "Gallery",
    },
    {
      name: "Blogs",
    },
    {
      name: "Testimonials",
    },
  ];

  const logoutHandler = async () => {
    const toastId = toast.loading("Loading...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.logout(token);
      toast.success(data.message, {
        id: toastId,
      });
      localStorage.removeItem("token");
      dispatch(authAction.userNotExists());
      dispatch(setIsMenu(false));
    } catch (error) {
      dispatch(authAction.userExists());
      toast.success(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
      dispatch(setIsMenu(false));
    }
  };
  return (
    <div className={`menu-bar ${isMenu ? "active" : ""}`}>
      <div>
        <div className="menubar-header">
          <h5 style={{ color: "white" }}>MENU</h5>
          <div onClick={() => toggleMenu()}>
            <IoMdClose color="white" size={30} cursor={"pointer"} />
          </div>
        </div>
        <div className="menu-container">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-items">
              <h6>{item.name}</h6>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "white",
          backgroundColor: "#f72c5b",
          padding: "15px 10px",
          cursor: "pointer",
        }}
        onClick={logoutHandler}
      >
        <IoLogOutOutline />
        <h6>LogOut</h6>
      </div>
    </div>
  );
};

export default MenuBar;
