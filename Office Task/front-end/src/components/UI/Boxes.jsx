import React, { useState, useEffect } from "react";
import { BiDollarCircle } from "react-icons/bi";
import { FaRegClock, FaRegBookmark, FaBookmark } from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";
import api_services from "../../services/api_services";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Boxes = ({
  id,
  name,
  image,
  currentBid,
  startsIn,
  endsIn,
  isvisible = true,
}) => {
  const today = Date.now();
  const { user } = useSelector((store) => store.auth);

  const checkBookmarked = user?.bookmarkedProduct?.some(
    (item) => item._id === id
  );

  const [bookmark, setBookmark] = useState(false);

  const handleBookmark = async () => {
    const toastId = toast.loading("Loading...");
    try {
      setBookmark(!bookmark);
      const token = localStorage.getItem("token");
      const { data } = await api_services.bookMarked(id, token);
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message, { id: toastId });
    }
  };

  return (
    <div className="single-box">
      <div
        to={`/bid/${id}`}
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
        {isvisible && (
          <div
            style={{
              height: 35,
              width: 35,
              borderRadius: "50%",
              backgroundColor: "#f72c5b",
              position: "absolute",
              right: 5,
              top: 5,
              border: "3px solid white",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
            onClick={handleBookmark}
          >
            {checkBookmarked || bookmark ? (
              <FaBookmark color="white" />
            ) : (
              <FaRegBookmark color="white" />
            )}
          </div>
        )}

        <div
          style={{
            borderRadius: "0px 10px 10px 0px",
            backgroundColor: "#f72c5b",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: 5,
            left: -5,
            bottom: 5,
            border: "3px solid white",
          }}
        >
          <FaRegClock color="white" size={15} />
          <p style={{ color: "white", fontSize: 12 }}>
            {moment(startsIn).diff(today, "days")} days left
          </p>
        </div>
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
        <Link to={`/bid/${id}`} style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: 3,
              outline: "none",
              border: "none",
              borderRadius: 10,
              backgroundColor: "#C30E59",
              color: "white",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <BiDollarCircle size={20} />
            Bid Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Boxes;
