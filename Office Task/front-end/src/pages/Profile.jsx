import React, { useEffect, useState } from "react";
import {
  FaAward,
  FaBookmark,
  FaEdit,
  FaHome,
  FaRegUser,
  FaTrophy,
} from "react-icons/fa";

import { FaMoneyBill1Wave } from "react-icons/fa6";
import { IoBagAdd, IoBagHandle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import EditDialog from "../components/Dialog/EditDialog";
import ProductDialog from "../components/Dialog/ProductDialog";
import Loader from "../components/Loader/Loader";
import Boxes from "../components/UI/Boxes";
import { authAction } from "../redux/reducers/auth";
import { setIsAddProductDialog, setIsEditDialog } from "../redux/reducers/misc";
import api_services from "../services/api_services";
import "./style.css";
import { Dialog } from "@mui/material";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, isLoading } = useSelector((store) => store.auth);
  const [isAmountDialogVisible, setIsAmountDialogVisible] = useState(false);

  const dispatch = useDispatch();

  const onLoadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.profile(token);
      dispatch(authAction.userExists(data.user));
    } catch (error) {
      dispatch(authAction.userNotExists());
    }
  };

  const toggleOpenEditDialog = () => {
    dispatch(setIsEditDialog(true));
  };

  const toggleOpenAddProduct = () => {
    dispatch(setIsAddProductDialog(true));
  };

  useEffect(() => {
    onLoadUser();
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <div className="profile-container">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="profile-box">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    alignItems: "flex-end",
                  }}
                >
                  <FaRegUser size={25} />
                  <p>User Profile</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#A294F9",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                    onClick={toggleOpenEditDialog}
                  >
                    <FaEdit color="white" />
                    <p style={{ color: "white" }}>Edit Profile</p>
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#3E7B27",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                    onClick={toggleOpenAddProduct}
                  >
                    <IoBagAdd color="white" />
                    <p style={{ color: "white" }}>Add Product</p>
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#f72c5b",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                    onClick={() => setIsAmountDialogVisible(true)}
                  >
                    <FaMoneyBill1Wave color="white" />
                    <p style={{ color: "white" }}>Add Amount</p>
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#f72c5b",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                  >
                    <FaHome color="white" />
                    <p style={{ color: "white" }}>Back to Home</p>
                  </div>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-circle">
                  <img
                    src={user?.profileImage}
                    alt=""
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="profile-title">
                  <p style={{ fontSize: 30 }}>{user?.displayName}</p>
                  <p style={{ fontSize: 20 }}>
                    Balance :{" "}
                    <span style={{ color: "red" }}>${user?.balance}</span>
                  </p>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 17 }}>Email:</p>
                      <p style={{ color: "red" }}>{user?.email}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 17 }}>Phone No:</p>
                      <p style={{ color: "red" }}>
                        {user?.phoneNo ? user?.phoneNo : "Google Account"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-recent-bid">
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-end",
                  marginBottom: 10,
                }}
              >
                <IoBagHandle size={25} />
                <p>My Products</p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {user?.ownProduct?.map((item, index) => {
                  const yourBid = item?.bids.filter(
                    (bid) => bid.userId === user._id
                  );

                  return (
                    <BidItem
                      key={index}
                      id={item._id}
                      name={item.productName}
                      currentBid={item.currentBid}
                      productImage={item.productImage}
                      yourBid={yourBid}
                    />
                  );
                })}
              </div>
            </div>
            <div className="profile-recent-bid">
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-end",
                  marginBottom: 10,
                }}
              >
                <FaBookmark size={25} />
                <p>My Upcomming Bids</p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {user?.bookmarkedProduct?.map((item, index) => {
                  return (
                    <Boxes
                      key={index}
                      id={item._id}
                      name={item.productName}
                      image={item.productImage}
                      currentBid={item.currentBid}
                      startsIn={item.startsIn}
                      endsIn={item.endsIn}
                      isvisible={false}
                    />
                  );
                })}
              </div>
            </div>
            <div className="profile-recent-bid">
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-end",
                  marginBottom: 10,
                }}
              >
                <FaAward size={25} />
                <p>My Recent Bids</p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {user?.recentBid?.map((item, index) => {
                  const yourBid = item?.bids.filter(
                    (bid) => bid.userId === user._id
                  );

                  return (
                    <BidItem
                      key={index}
                      id={item._id}
                      name={item.productName}
                      currentBid={item.currentBid}
                      productImage={item.productImage}
                      yourBid={yourBid}
                    />
                  );
                })}
              </div>
            </div>
            <div className="profile-recent-bid">
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-end",
                  marginBottom: 10,
                }}
              >
                <FaTrophy size={25} />
                <p>Your Winning Bids</p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <BidItem />
              </div>
            </div>
          </>
        )}
      </div>
      <EditDialog onLoadUser={onLoadUser} />
      <ProductDialog />
      <AddAmount
        isAmountDialogVisible={isAmountDialogVisible}
        setIsAmountDialogVisible={setIsAmountDialogVisible}
        onLoadUser={onLoadUser}
      />
    </>
  );
};

const BidItem = ({ id, name, currentBid, productImage, yourBid }) => {
  return (
    <div
      style={{
        width: 300,
        backgroundColor: "#D9DFC6",
        borderRadius: 10,
        overflow: "hidden",
        padding: 10,
      }}
    >
      <div
        style={{
          height: 210,
          width: "100%",
          backgroundColor: "firebrick",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Link to={`/bid/${id}`}>
          <img
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            src={productImage}
            alt=""
          />
        </Link>
      </div>
      <p style={{ textAlign: "center" }}>{name}</p>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Current Bid</p>
          <p>$ {currentBid}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Your Bid</p>
          {yourBid?.map((item, index) => (
            <p key={index}>$ {item.bid}</p>
          ))}
        </div>
      </div>
      <Link to={`/bid/${id}`}>
        <button
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            padding: "10px 0",
            borderRadius: 10,
            marginTop: 10,
            backgroundColor: "#f72c5b",
            color: "white",
            cursor: "pointer",
          }}
        >
          View Product
        </button>
      </Link>
    </div>
  );
};

const AddAmount = ({
  isAmountDialogVisible,
  setIsAmountDialogVisible,
  onLoadUser,
}) => {
  const [balance, setBalance] = useState();

  const addAmountHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Adding Amount...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.addAmount(balance, token);
      setBalance("");
      setIsAmountDialogVisible(false);
      onLoadUser();
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const closeHandler = () => {
    setIsAmountDialogVisible(false);
  };
  return (
    <Dialog
      open={isAmountDialogVisible}
      onClose={closeHandler}
      fullWidth
      maxWidth="xs"
    >
      <form
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        onSubmit={addAmountHandler}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Enter Your Amount Here</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            type="number"
            placeholder="Place Your Amount Here"
            required
          />
        </div>
        <button
          type="submit"
          style={{
            outline: "none",
            padding: 10,
            border: "none",
            borderRadius: 10,
            backgroundColor: "#f72c5b",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Amount
        </button>
      </form>
    </Dialog>
  );
};

export default Profile;
