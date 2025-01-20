import { Dialog } from "@mui/material";
import React, { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddProductDialog } from "../../redux/reducers/misc";
import api_services from "../../services/api_services";
import toast from "react-hot-toast";

const ProductDialog = () => {
  const { isAddProductDialog } = useSelector((store) => store.misc);
  const productName = useRef(null);
  const productImage = useRef(null);
  const currentBid = useRef(null);
  const description = useRef(null);
  const startsIn = useRef(null);
  const endsIn = useRef(null);
  const catagory = useRef(null);
  const genericName = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();

  const closeAddProductDialog = () => {
    dispatch(setIsAddProductDialog(false));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const toastId = toast.loading("Loading...");

    formData.append("productName", productName.current.value);
    formData.append("productImage", productImage.current.files[0]);
    formData.append("currentBid", currentBid.current.value);
    formData.append("description", description.current.value);
    formData.append("startsIn", startsIn.current.value);
    formData.append("endsIn", endsIn.current.value);
    formData.append("catagory", catagory.current.value);
    formData.append("genericName", genericName.current.value);
    console.log(formData);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.addProduct(token, formData);
      toast.success(data.message, { id: toastId });
      dispatch(setIsAddProductDialog(false));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog
      open={isAddProductDialog}
      onClose={closeAddProductDialog}
      fullWidth
      maxWidth="sm"
    >
      <form
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        onSubmit={handleSubmit}
      >
        <div
          style={{
            width: "100%",
            height: 250,
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Product"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CiImageOn color="#aaa" size={25} />
              <span style={{ color: "#aaa" }}>Please Select the Image</span>
            </div>
          )}
          <div
            style={{
              height: 35,
              width: 35,
              backgroundColor: "#f5efe7",
              position: "absolute",
              borderRadius: "50%",
              right: 6,
              bottom: 4,
              border: "3px solid white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CiImageOn size={20} cursor="pointer" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={productImage}
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Name</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            ref={productName}
            type="text"
            placeholder="Enter your product name"
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Initial Bid</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            ref={currentBid}
            type="number"
            placeholder="Enter your Product Initial Bid"
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Description</label>
          <textarea
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            ref={description}
            placeholder="Enter your Product Description"
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Catagory</label>
          <select
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              backgroundColor: "white",
              border: "1px solid gray",
            }}
            ref={catagory}
            required
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            <option value="Accounts">Accounts</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashions">Fashions</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Generic Type</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            ref={genericName}
            type="text"
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Start Bid</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            ref={startsIn}
            type="datetime-local"
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>End Bid</label>
          <input
            style={{
              padding: 10,
              outline: "none",
              borderRadius: 10,
              border: "1px solid gray",
            }}
            ref={endsIn}
            type="datetime-local"
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
          Add Product
        </button>
      </form>
    </Dialog>
  );
};

export default ProductDialog;
