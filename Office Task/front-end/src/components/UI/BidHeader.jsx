import { AiOutlineMenu } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";

import React from "react";
import { FaUser } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.css";

export const BidHeader = ({ name }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const toggleBack = () => {
    navigate("/");
  };

  const toggleToProfile = () => {
    navigate("/profile");
  };

  return (
    <div
      style={{
        width: "100%",
        height: 65,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
        boxShadow: "5px 5px 10px 5px rgba(0, 0, 0, 0.3)",
        backgroundColor: "white",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 15 }}
        onClick={() => toggleBack()}
      >
        <IoMdArrowRoundBack size={25} cursor={"pointer"} />
        <p style={{ fontSize: 15 }}>{name}</p>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={toggleToProfile}
        >
          <FaUser size={25} />
          <p style={{ fontSize: 15 }}>{user?.displayName}</p>
        </div>
      </div>
    </div>
  );
};
