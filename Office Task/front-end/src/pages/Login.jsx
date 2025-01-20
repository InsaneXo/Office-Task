import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";

import { authAction } from "../redux/reducers/auth";
import api_services from "../services/api_services";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { server } from "../components/constant/config";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleLogin = () => {
    window.open(`${server}/api/v1/auth/google/callback`, "_self");
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging...");
    try {
      const isEmail = formData.usernameOrEmail.includes("@");
      const payload = isEmail
        ? { email: formData.usernameOrEmail, password: formData.password }
        : { username: formData.usernameOrEmail, password: formData.password };
      const { data } = await api_services.login(payload);
      localStorage.setItem("token", data.token);
      dispatch(authAction.userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
      setFormData({
        usernameOrEmail: "",
        password: "",
      });
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
        <div style={{ marginBottom: 45 }}>
          <h2 style={{ textAlign: "center" }}>Welcome to "The Desi Bazzar"</h2>
          <p style={{ textAlign: "center" }}>
            Bid for the best products at great price!
          </p>
        </div>
        <form className="form-data" onSubmit={formSubmitHandler}>
          <div className="input-div">
            <p>Username</p>
            <input
              type="text"
              placeholder="Enter your Username or Email"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-div">
            <p>Password</p>
            <input
              type="text"
              placeholder="Enter your Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <p
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => navigate("/forget-password")}
          >
            Forget Password
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <p
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Create an account
          </p>
          <p>Or Login with</p>
          <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
            <button
              style={{
                padding: "10px 80px",
                backgroundColor: "blue",
                border: "none",
                color: "white",
                borderRadius: 5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <FaFacebook size={35} color="white" />
              Sign In with Facebook
            </button>
            <button
              style={{
                padding: "10px 80px",
                backgroundColor: "#f5efe7",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={35} />
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
