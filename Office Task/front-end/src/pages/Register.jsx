import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./style.css";
import api_services from "../services/api_services";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNo: "",
    password: "",
    otp: "",
  });
  const [time, setTime] = useState(120);
  const [isOtpForm, setIsOtpForm] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const verifyHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Registering...");

    try {
      setIsLoading(true);
      const { data } = await api_services.verify(formData);
      setTime(120);
      setIsOtpForm(true);
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

  const resendOtpHandler = async () => {
    const toastId = toast.loading("Resending...");
    try {
      const { data } = await api_services.verify(formData);
      setTime(120);
      setIsOtpForm(true);
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
  };

  const createUserHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Verifying...");
    try {
      setIsLoading(true);
      const { data } = await api_services.register(formData);
      navigate("/login");
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

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

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
          onSubmit={isOtpForm ? createUserHandler : verifyHandler}
        >
          {isOtpForm ? (
            <>
              <div className="input-div">
                <p>OTP</p>
                <input
                  type="text"
                  placeholder="Enter your OTP"
                  name="otp"
                  value={formData.otp}
                  onChange={changeHandler}
                  required
                />
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  {`OTP are valid for ${time < 10 ? `0${time}` : time} sec`}
                </p>
                {time <= 0 && (
                  <p
                    style={{
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={resendOtpHandler}
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
                  cursor: isLoading ? "progress" : "pointer",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Verify"}
              </button>
            </>
          ) : (
            <>
              <div className="input-div">
                <p>Username</p>
                <input
                  type="text"
                  placeholder="Enter your Username"
                  name="username"
                  value={formData.username}
                  onChange={changeHandler}
                  required
                />
              </div>
              <div className="input-div">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  required
                />
              </div>
              <div className="input-div">
                <p>Phone No</p>
                <input
                  type="text"
                  placeholder="Enter your Phone No"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={changeHandler}
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
                  onChange={changeHandler}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: isLoading && "#FBF6E9",
                  color: isLoading && "black",
                  cursor: isLoading ? "progress" : "pointer",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Register"}
              </button>
              <p
                style={{
                  color: "blue",
                  cursor: "pointer",
                  marginTop: 10,
                  textAlign: "center",
                }}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
