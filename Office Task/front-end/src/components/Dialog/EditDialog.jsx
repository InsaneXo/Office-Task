import { Dialog } from "@mui/material";
import React, { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosCamera } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditDialog } from "../../redux/reducers/misc";
import api_services from "../../services/api_services";
import toast from "react-hot-toast";

const EditDialog = ({ onLoadUser }) => {
  const { user } = useSelector((store) => store.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { isEditDialog } = useSelector((store) => store.misc);
  const dispatch = useDispatch();

  const [formDataInput, setFormDataInput] = useState({
    username: "",
    displayName: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const profileImage = useRef("");
  const [previewImage, setPreviewImage] = useState(null);

  const toggleCloseEditDialog = () => {
    dispatch(setIsEditDialog(false));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormDataInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateUserHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", formDataInput.username);
    formData.append("displayName", formDataInput.displayName);
    formData.append("email", formDataInput.email);
    formData.append("phoneNo", formDataInput.phoneNo);
    formData.append("password", formDataInput.password);
    formData.append("profileImage", profileImage.current.files[0]);
    const toastId = toast.loading("Updating...");

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await api_services.updateProfile(token, formData);
      toggleCloseEditDialog();
      toast.success(data.message, { id: toastId });
      onLoadUser();
      setFormDataInput({
        username: "",
        displayName: "",
        email: "",
        phoneNo: "",
        password: "",
      });
      profileImage.current = null;
    } catch (error) {
      toast.success(data.message || "Somthing went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isEditDialog}
      onClose={toggleCloseEditDialog}
      fullWidth
      maxWidth={"sm"}
    >
      <form
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        onSubmit={updateUserHandler}
      >
        <div
          style={{
            width: "100%",
            height: 150,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 130,
                height: 130,
                backgroundColor: "#f5efe7",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <FaUser size={20} />
                </>
              )}
            </div>
            <label
              style={{
                height: 35,
                width: 35,
                backgroundColor: "#f5efe7",
                position: "absolute",
                borderRadius: "50%",
                right: 6,
                bottom: -1,
                border: "3px solid white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IoIosCamera size={25} cursor={"pointer"} />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={profileImage}
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        {user?.googleId ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="">Display Name</label>
            <input
              style={{
                padding: 10,
                outline: "none",
                borderRadius: 10,
                backgroundColor: "#f5efe7",
                border: "none",
              }}
              name="displayName"
              value={formDataInput.displayName}
              onChange={handleOnChange}
              type="text"
              placeholder={user?.displayName}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="">Username</label>
            <input
              style={{
                padding: 10,
                outline: "none",
                borderRadius: 10,
                backgroundColor: "#f5efe7",
                border: "none",
              }}
              name="username"
              value={formDataInput.username}
              onChange={handleOnChange}
              type="text"
              placeholder={user?.username}
            />
          </div>
        )}
        {user?.googleId ? null : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="">Email</label>
            <input
              style={{
                padding: 10,
                outline: "none",
                backgroundColor: "#f5efe7",
                borderRadius: 10,
                border: "none",
              }}
              name="email"
              value={formDataInput.email}
              onChange={handleOnChange}
              type="text"
              placeholder={user?.email}
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="">Phone No.</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              backgroundColor: "#f5efe7",
              borderRadius: 10,
              border: "none",
            }}
            name="phoneNo"
            value={formDataInput.phoneNo}
            onChange={handleOnChange}
            type="text"
            placeholder={
              user?.googleId ? "Enter your phone No." : user?.phoneNo
            }
          />
        </div>
        {user?.googleId ? null : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="">Password</label>
            <input
              style={{
                padding: 10,
                outline: "none",
                backgroundColor: "#f5efe7",
                borderRadius: 10,
                border: "none",
              }}
              name="password"
              value={formDataInput.password}
              onChange={handleOnChange}
              type="text"
              placeholder="Enter your Password"
            />
          </div>
        )}
        <button
          style={{
            outline: "none",
            padding: 10,
            border: "none",
            borderRadius: 10,
            backgroundColor: isLoading ? "#D9DFC6" : "#f72c5b",
            color: "white",
            cursor: isLoading ? "none" : "pointer",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Wait..." : "Update"}
        </button>
      </form>
    </Dialog>
  );
};

export default EditDialog;
