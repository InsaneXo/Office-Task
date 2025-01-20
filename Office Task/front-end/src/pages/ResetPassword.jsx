import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import api_services from "../services/api_services";
import toast from "react-hot-toast";
import { Dialog } from "@mui/material";
import { FaKey } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangePasswordForm, setIsChangePasswordForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const expiryTime = decodedToken.exp * 1000; //convert time into ms
      const updateTimer = () => {
        const currentTime = Date.now();
        const remainingTime = expiryTime - currentTime;
        setTimeLeft(Math.max(remainingTime, 0));
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [token]);

  const changePasswordHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating...");
    setIsLoading(true);
    try {
      const { data } = await api_services.updateUserPassword(
        formData.newPassword,
        formData.confirmPassword,
        token
      );
      toast.success(data.message, { id: toastId });
      navigate("/login");
    } catch (error) {
      if (
        error?.response?.data?.message === "Your Reset Link and OTP is expired"
      ) {
        navigate("/forget-password");
      }
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const otpHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Verifying...");
    setIsLoading(true);
    try {
      const { data } = await api_services.verifyResetPassword(
        formData.otp,
        token
      );
      setIsChangePasswordForm(true);
      toast.success(data.message, { id: toastId });
    } catch (error) {
      if (
        error?.response?.data?.message === "Your Reset Link and OTP is expired"
      ) {
        navigate("/forget-password");
      }
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendResetLinkHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending...");
    setIsLoading(true);
    try {
      const { data } = await api_services.resetPassword(email);
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkToken = async () => {
    try {
      const { data } = await api_services.checkToken(token);
      setEmail(data.email);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      navigate("/forget-password");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

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
        <form
          className="form-data"
          onSubmit={isChangePasswordForm ? changePasswordHandler : otpHandler}
        >
          {isChangePasswordForm ? (
            <>
              <div className="input-div">
                <p>New Password</p>
                <input
                  type="text"
                  placeholder="Enter your New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-div">
                <p>Confirm Password</p>
                <input
                  type="text"
                  placeholder="Enter your Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                {isLoading ? "Loading..." : "Set Password"}
              </button>
            </>
          ) : (
            <>
              <div className="input-div">
                <p>OTP</p>
                <input
                  type="text"
                  placeholder="Enter your OTP"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "red",
                  }}
                >
                  {`OTP are valid for ${
                    Math.floor(timeLeft / 1000) < 10
                      ? `0${Math.floor(timeLeft / 1000)}`
                      : Math.floor(timeLeft / 1000)
                  } sec`}
                </p>
                {timeLeft <= 0 && (
                  <p
                    style={{
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={sendResetLinkHandler}
                  >
                    Resend OTP
                  </p>
                )}
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: isLoading && "#FBF6E9",
                  color: isLoading && "black",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Verify"}
              </button>
            </>
          )}
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
export default ResetPassword;

const TokenExpireDialog = ({ openDialog }) => {
  const navigate = useNavigate();
  return (
    <Dialog open={openDialog} fullWidth maxWidth={"sm"}>
      <div
        style={{
          height: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaKey size={65} />
          <h2 style={{ color: "#f72c5b" }}>Token Expired</h2>
        </div>
        <p>Your token has been expired</p>
        <button
          style={{
            padding: "10px 30px",
            outline: "none",
            backgroundColor: "#f72c5b",
            border: "none",
            color: "white",
            borderRadius: 10,
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>
    </Dialog>
  );
};
