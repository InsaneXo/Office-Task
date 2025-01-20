import { PieChart } from "@mui/x-charts/PieChart";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaRegClock, FaUserCheck } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CustomDialog } from "../../components/Dialog/CustomDialog";
import { authAction } from "../../redux/reducers/auth";
import api_services from "../../services/api_services";
import AdminLayout from "./AdminLayout";
import AdminLoader from "./AdminLoader";
import toast from "react-hot-toast";

const Dashboard = () => {
  const today = Date.now();
  const [dashboardData, setDashboardData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const getDashboardStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("admin_token");
      const { data } = await api_services.dashboardStats(token);
      setDashboardData(data.dashboardStats);
      dispatch(authAction.isAdminExists());
    } catch (error) {
      dispatch(authAction.isAdminNotExists());
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDashboardStats();
  }, []);

  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <AdminLayout>
      <div className="dashboard-container">
        {isLoading ? (
          <AdminLoader />
        ) : (
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
              <p style={{ fontSize: 20 }}>Hello Admin, How are you</p>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <FaRegClock size={25} />
                <p>{moment(today).format("dddd, D MMMM YYYY")}</p>
              </div>
            </div>
            <div
              style={{
                padding: 10,
                width: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                marginTop: 10,
                display: "flex",
              }}
            >
              <div>
                <PieChart
                  colors={["red", "blue", "green"]}
                  series={[
                    {
                      data: [
                        {
                          label: "Products",
                          value: dashboardData?.data[0].value,
                        },
                        { label: "Users", value: dashboardData?.data[1].value },
                        {
                          label: "Logged In",
                          value: dashboardData?.data[2].value,
                        },
                      ],
                      innerRadius: 60,
                      outerRadius: 135,
                      paddingAngle: 2,
                      cornerRadius: 0,
                      startAngle: 0,
                      endAngle: 360,
                      cx: 140,
                    },
                  ]}
                  // sx={{
                  //   [`& .${pieArcLabelClasses.root}`]: {
                  //     fill: "white",
                  //     fontSize: 14,
                  //   },
                  // }}
                  slotProps={{ legend: { hidden: true } }}
                  width={300}
                  height={300}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "space-evenly",
                }}
              >
                <div
                  style={{
                    height: 300,
                    width: 300,
                    backgroundColor: "#f5efe7",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <h1 style={{ fontSize: 60, color: "red" }}>
                    {dashboardData?.users < 10
                      ? `0${dashboardData?.users}`
                      : dashboardData?.users}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontSize: 25 }}>Users</p>
                    <FaUserCheck size={40} />
                  </div>
                </div>
                <div
                  style={{
                    height: 300,
                    width: 300,
                    backgroundColor: "#f5efe7",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <h1 style={{ fontSize: 60, color: "red" }}>
                    {dashboardData?.products < 10
                      ? `0${dashboardData?.products}`
                      : dashboardData?.products}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontSize: 25 }}>Products</p>
                    <IoBagCheck size={40} />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: 10,
                width: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 20 }}>Top Bidding on the Products</p>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: 5,
                  display: "flex",
                  gap: 5,
                  overflow: "auto",
                  flexWrap: "wrap",
                }}
              >
                {dashboardData?.topBiddingProducts.map((item, index) => (
                  <BidItem
                    key={index}
                    image={item.productImage}
                    startsIn={item.startsIn}
                    name={item.productName}
                    endsIn={item.endsIn}
                    currentBid={item.currentBid}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 10,
                width: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 20 }}>Current Logged In Users</p>
              </div>
              {dashboardData?.totalLoggedInUser.map((item, index) => (
                <UserItem
                  key={index}
                  _id={item._id}
                  issuesAt={item.issuesAt}
                  expiresAt={item.expiresAt}
                  displayName={item.displayName}
                  profileImage={item.profileImage}
                  email={item.email}
                  getDashboardStats={getDashboardStats}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

const BidItem = ({ image, name, startsIn, endsIn, currentBid }) => {
  return (
    <div className="single-box">
      <div
        style={{
          width: "100%",
          height: 250,
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={image}
          alt=""
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </div>
      <p>{name}</p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>Current Bid</p>
          <p style={{ color: "red" }}>$ {currentBid}</p>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#8EB486",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <p style={{ color: "white" }}>Event Starts at</p>
          <p style={{ color: "white" }}>
            {moment(startsIn).format("MMMM Do , h:mm a")}
          </p>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f72c5b",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <p style={{ color: "white" }}>Event Ends at</p>
          <p style={{ color: "white" }}>
            {moment(endsIn).format("MMMM Do , h:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
};
const UserItem = ({
  _id,
  issuesAt,
  expiresAt,
  displayName,
  profileImage,
  email,
  getDashboardStats,
}) => {
  const [open, setOpen] = useState(false);

  const userLogOutHandler = async () => {
    const toastId = toast.loading("Loading...");
    try {
      const token = localStorage.getItem("admin_token");
      const { data } = await api_services.userLoggedOut(_id, token);

      getDashboardStats();
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Somthing went wrong", {
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
            height: "100%",
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
          <p>
            Issue At :{" "}
            <span style={{ color: "red" }}>
              {moment(issuesAt).format("dddd, D MMMM YYYY")}
            </span>
          </p>
          <p>
            Expires At :{" "}
            <span style={{ color: "red" }}>
              {moment(expiresAt).format("dddd, D MMMM YYYY")}
            </span>
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
        <RiLogoutBoxLine size={25} />
        <p style={{ fontSize: 15 }}>Log Out</p>
      </div>
      <CustomDialog
        dialogTitle={"Are you want to logout this user ?"}
        open={open}
        setOpen={setOpen}
        handler={userLogOutHandler}
      />
    </div>
  );
};

export default Dashboard;
