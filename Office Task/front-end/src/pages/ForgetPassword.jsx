import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import "./style.css";
import api_services from "../services/api_services";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const sendResetLinkController = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending...");
    setIsLoading(true);
    try {
      const { data } = await api_services.resetPassword(email);
      toast.success(data.message, {
        id: toastId,
      });
      localStorage.clear("reloadCount");
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-container">
        <h1>LOGO</h1>
      </div>
      <div className="right-container">
        <div style={{ marginBottom: 25 }}>
          <h2 style={{ textAlign: "center" }}>Welcome to "The Desi Bazzar"</h2>
          <p style={{ textAlign: "center" }}>
            Bid for the best products at great price!
          </p>
        </div>
        <form className="form-data" onSubmit={sendResetLinkController}>
          <div className="input-div">
            <p>Email</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: isLoading && "#FBF6E9",
              color: isLoading && "black",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Send a verification link"}
          </button>
        </form>

        <p
          style={{ color: "blue", cursor: "pointer", marginTop: 10 }}
          onClick={() => navigate("/login")}
        >
          Back to login
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 25,
            marginTop: 15,
            alignItems: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ForgetPassword;
