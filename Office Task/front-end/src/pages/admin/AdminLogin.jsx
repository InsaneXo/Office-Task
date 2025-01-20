import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authAction } from "../../redux/reducers/auth";
import api_services from "../../services/api_services";
import "./style.css";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { isAdmin } = useSelector((store) => store.auth);
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const formSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      const { data } = await api_services.adminLoggedIn(secretKey);
      localStorage.setItem("admin_token", data.token);
      dispatch(authAction.isAdminExists());
      setSecretKey("");
      toast.success(data.message, { id: toastId });
    } catch (error) {
      dispatch(authAction.isAdminNotExists());
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        console.log("No token found");
        dispatch(authAction.isAdminNotExists());
        return;
      }
      await api_services.checkAdmin(token);
      dispatch(authAction.isAdminExists());
    } catch (error) {
      console.error(
        "Error during admin check:",
        error?.response?.data?.message
      );
      dispatch(authAction.isAdminNotExists());
    }
  };
  useEffect(() => {
    checkAdmin();
  }, []);

  if (isAdmin) return <Navigate to={"/admin/dashboard"} />;

  return (
    <div className="login-container">
      <div className="left-container">
        <h1>LOGO</h1>
      </div>
      <div className="right-container">
        <div style={{ marginBottom: 45 }}>
          <h2 style={{ textAlign: "center" }}>Welcome to "The Desi Bazzar"</h2>
          <p style={{ textAlign: "center" }}>
            Bid for the best products at great price!
          </p>
        </div>
        <form className="form-data" onSubmit={formSubmit}>
          <div className="input-div">
            <p>Secret Key</p>
            <input
              type="text"
              placeholder="Enter your Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: isLoading && "#FBF6E9",
              color: isLoading && "black",
              cursor: "pointer",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
