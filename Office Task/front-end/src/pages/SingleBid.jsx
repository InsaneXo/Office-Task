import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuAlarmClock } from "react-icons/lu";
import { useSelector } from "react-redux";
import { data, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { BidHeader } from "../components/UI/BidHeader";
import RecentBid from "../components/UI/RecentBid";
import { useSocketEvent } from "../hooks/hook";
import api_services from "../services/api_services";
import { getSocket } from "../socket";

const calculateTimeLeft = (target) => {
  const targetDate = new Date(target).getTime();
  const currentTime = Date.now();
  return Math.max(0, Math.floor((targetDate - currentTime) / 1000));
};

const SingleBid = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [realTimeWinnerData, setRealTimeWinnerData] = useState(null);
  const [myWinningDialog, setMyWinningDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState();
  const [targetTime, setTargetTime] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [amount, setAmount] = useState();

  const { user } = useSelector((store) => store.auth);
  const socket = getSocket();
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      setIsLoading(true); // Start loading
      const token = localStorage.getItem("token");
      const { data } = await api_services.singleProduct(token, id);
      setTargetTime(data.product.endsIn);
      setProduct(data);
      setTimeLeft(calculateTimeLeft(data.product.endsIn)); // Initialize timeLeft
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false); // Stop loading after fetching data
    }
  };

  const addBid = async (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    const toastId = toast.loading("Adding...");
    socket.emit(
      "NEW_BID",
      { bidAmount, productId: id, userId: user._id },
      (response) => {
        if (response.success) {
          toast.success(response.message, { id: toastId });
        } else {
          toast.error(response.message, { id: toastId });
        }
        setIsFormLoading(false);
      }
    );
    setBidAmount("");
  };

  const winnerHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.bidWinner(id, token);
      if (data.user.userId === user._id) {
        setMessage(data.user.message);
        setAmount(data.user.amount);
        setMyWinningDialog(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hrs = Math.floor((seconds % (24 * 3600)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <LuAlarmClock size={25} />
          <p>Time Remaining :</p>
        </div>
        {timeLeft === 0 ? (
          <p style={{ color: "#f72c5b" }}>Time Up</p>
        ) : (
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <div
              style={{
                backgroundColor: "#f72c5b",
                height: 35,
                width: 35,
                borderRadius: 5,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h6 style={{ fontSize: 10 }}>{days}</h6>
              <h6 style={{ fontSize: 10 }}>Days</h6>
            </div>
            <p style={{ color: "#f72c5b" }}>:</p>
            <div
              style={{
                backgroundColor: "#f72c5b",
                height: 35,
                width: 35,
                borderRadius: 5,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h6 style={{ fontSize: 10 }}>
                {hrs.toString().padStart(2, "0")}
              </h6>
              <h6 style={{ fontSize: 10 }}>Hrs</h6>
            </div>
            <p style={{ color: "#f72c5b" }}>:</p>
            <div
              style={{
                backgroundColor: "#f72c5b",
                height: 35,
                width: 35,
                borderRadius: 5,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h6 style={{ fontSize: 10 }}>
                {mins.toString().padStart(2, "0")}
              </h6>
              <h6 style={{ fontSize: 10 }}>Mins</h6>
            </div>
            <p style={{ color: "#f72c5b" }}>:</p>
            <div
              style={{
                backgroundColor: "#f72c5b",
                height: 35,
                width: 35,
                borderRadius: 5,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h6 style={{ fontSize: 10 }}>
                {secs.toString().padStart(2, "0")}
              </h6>
              <h6 style={{ fontSize: 10 }}>Sec</h6>
            </div>
          </div>
        )}
      </div>
    );
  };

  const proceedToPayHandler = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.proceedToPay(amount, id, token);
      setMyWinningDialog(false);
      navigate("/");
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const deniedPaymentHandler = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.deniedPayment(id, token);
      setMyWinningDialog(false);
      navigate("/");
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const newBidListener = useCallback(
    (data) => {
      if (data.productId !== id) return;
      setRealTimeData(data);
    },
    [id]
  );
  const winnerBidListerner = useCallback(
    (data) => {
      if (data.productId !== id) return;
      setRealTimeWinnerData(data);
    },
    [id]
  );

  const eventHandler = {
    ["BID_UPDATED"]: newBidListener,
    ["PRODUCT_WINNER"]: winnerBidListerner,
  };

  useSocketEvent(socket, eventHandler);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      winnerHandler();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, targetTime]);

  return (
    <div>
      {isloading ? (
        <Loader />
      ) : (
        <>
          <BidHeader name={product?.product?.productName} />
          <div className="bid-container">
            <div className="bid-left">
              <div className="bid-image">
                <img src={product?.product?.productImage} alt="Product" />
              </div>
            </div>
            <div className="bid-right">
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <h1 style={{ fontSize: 40 }}>
                  {product?.product?.productName}
                </h1>
                <p>
                  Current Bid:{" "}
                  <span style={{ color: "red" }}>
                    $
                    {realTimeData
                      ? realTimeData.currentBid
                      : product?.product?.currentBid}
                  </span>
                </p>
                <p style={{ textAlign: "justify", marginBottom: 10 }}>
                  Product Description:{" "}
                  <span style={{ color: "red" }}>
                    {product?.product?.description}
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    height: 20,
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {formatTime(timeLeft)}
                </div>

                <form className="bid-form" onSubmit={addBid}>
                  <input
                    type="number"
                    placeholder="Enter Your Amount here"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                  />
                  <button
                    style={{
                      cursor: isFormLoading ? "progress" : "pointer",
                      backgroundColor: isFormLoading ? "#FF8383" : "#f72c5b",
                    }}
                    type="submit"
                    disabled={isFormLoading}
                  >
                    {isFormLoading ? "Wait..." : "Bid Now"}
                  </button>
                </form>
              </div>
              <RecentBid product={product} realTimeData={realTimeData} />
            </div>
          </div>
          {myWinningDialog && (
            <MyWinnerDialog
              dialogTitle={message}
              open={myWinningDialog}
              setOpen={setMyWinningDialog}
              handler={proceedToPayHandler}
              deniedPaymentHandler={deniedPaymentHandler}
            />
          )}
          {realTimeWinnerData && realTimeWinnerData?.email !== user?.email && (
            <AnotherUserDialog
              dialogTitle={realTimeWinnerData?.message}
              open={true}
            />
          )}
        </>
      )}
    </div>
  );
};

const MyWinnerDialog = ({
  dialogTitle,
  open,
  setOpen,
  handler,
  deniedPaymentHandler,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Please Click Proceed to pay button to continue"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deniedPaymentHandler}>Disagree</Button>
          <Button onClick={handler}>Proceed to pay</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const AnotherUserDialog = ({ dialogTitle, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          Better luck next time !
        </DialogTitle>
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Please Click Go Home button to continue"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SingleBid;
