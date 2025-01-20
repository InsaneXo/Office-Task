import React from "react";

const BidItem = ({
  name,
  bid,
  image,
  bgColor = "#f5efe7",
  color = "black",
}) => {
  return (
    <div
      className="bid-item"
      style={{ backgroundColor: bgColor, color: color }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div className="bid-user-image">
          <img
            src={image}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            alt=""
          />
        </div>
        <p>{name}</p>
      </div>
      <p>${bid}</p>
    </div>
  );
};

export default BidItem;
