import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { FaUserCheck } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import api_services from "../../services/api_services";
import { authAction } from "../../redux/reducers/auth";
import { CustomDialog } from "../../components/Dialog/CustomDialog";
import AdminLoader from "./AdminLoader";
import { IoSearch } from "react-icons/io5";
import toast from "react-hot-toast";

const User = () => {
  const { isAdmin } = useSelector((store) => store.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState();
  const dispatch = useDispatch();

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("admin_token");
      const { data } = await api_services.allUser(search, token);
      setUsersData(data.users);
      dispatch(authAction.isAdminExists());
    } catch (error) {
      dispatch(authAction.isAdminNotExists());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => getAllUsers(), [1000]);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search]);

  if (!isAdmin) return <Navigate to={"/admin"} />;
  return (
    <AdminLayout>
      <div className="user-container">
        <>
          <div
            style={{
              padding: 10,
              width: "100%",
              backgroundColor: "white",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FaUserCheck size={25} />
              <p style={{ fontSize: 20 }}>All Users</p>
            </div>
            <div
              style={{
                position: "relative",
                bottom: 0,
              }}
            >
              <input
                type="text"
                style={{
                  padding: 10,
                  outline: "none",
                  borderRadius: 50,
                  border: "none",
                  backgroundColor: "#f5efe7",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user"
              />
              <div style={{ position: "absolute", right: 5, top: 9 }}>
                <IoSearch size={20} color="black" />
              </div>
            </div>
          </div>
          <div
            style={{
              padding: 10,
              width: "100%",
              height: "90%",
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: 10,
              overflow: "auto",
            }}
          >
            {isLoading ? (
              <AdminLoader />
            ) : (
              usersData?.map((item, index) => (
                <UserItem
                  key={index}
                  _id={item._id}
                  displayName={item.displayName}
                  email={item.email}
                  profileImage={item.profileImage}
                  getAllUsers={getAllUsers}
                />
              ))
            )}
          </div>
        </>
      </div>
    </AdminLayout>
  );
};

const UserItem = ({ _id, displayName, email, profileImage, getAllUsers }) => {
  const [open, setOpen] = useState(false);

  const userDeleteController = async () => {
    const toastId = toast.loading("Deleting User...");
    try {
      const token = localStorage.getItem("admin_token");
      const { data } = await api_services.userDelete(_id, token);
      setOpen(false);
      toast.success(data.message, {
        id: toastId,
      });
      getAllUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
  };
  return (
    <div
      style={{
        backgroundColor: "#f5efe7",
        height: 140,
        width: "100%",
        borderRadius: 10,
        padding: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <div style={{ height: "100%", display: "flex", gap: 6 }}>
        <div
          style={{
            width: 130,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <img
            src={profileImage}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            alt=""
          />
        </div>
        <div>
          <p>{displayName}</p>
          <p>
            Email : <span style={{ color: "red" }}>{email}</span>
          </p>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#f72c5b",
          height: "100%",
          width: 150,
          borderRadius: 10,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
        onClick={() => setOpen(true)}
      >
        <RiDeleteBin5Fill size={25} />
        <p style={{ fontSize: 15 }}>Delete</p>
      </div>
      <CustomDialog
        dialogTitle={"Are you want to delete this user ?"}
        open={open}
        setOpen={setOpen}
        handler={userDeleteController}
      />
    </div>
  );
};

export default User;
