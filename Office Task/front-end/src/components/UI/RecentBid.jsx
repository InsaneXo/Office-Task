import React from "react";
import BidItem from "./BidItem";
import { useSelector } from "react-redux";

const RecentBid = ({ product, realTimeData }) => {
  const { user } = useSelector((store) => store.auth);

  const activeData = realTimeData?.bids?.length
    ? realTimeData
    : product?.product;

  const myBids = activeData?.bids.filter(
    (item) => item.userId._id === user._id
  );

  const anotherBids = activeData?.bids
    .filter((item) => item.userId._id !== user._id)
    .sort((a, b) => b.bid - a.bid);

  return (
    <div className="recent-bid">
      {activeData?.bids?.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 10 }}>
          No Bidding in this Product Right Now
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            width: "100%",
            height: 450,
            overflow: "auto",
          }}
        >
          <h4>Recent Bids</h4>

          {myBids?.map((bid, index) => (
            <BidItem
              key={index}
              name={bid.userId.displayName}
              bid={bid.bid}
              image={bid.userId.profileImage}
              bgColor={"#f72c5b"}
              color={"white"}
            />
          ))}

          {anotherBids?.map((bid, index) => (
            <BidItem
              key={index}
              name={bid.userId.displayName}
              bid={bid.bid}
              image={bid.userId.profileImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentBid;
