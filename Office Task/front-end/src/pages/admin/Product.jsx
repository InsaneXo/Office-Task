import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoBagCheck, IoClose } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CustomDialog } from "../../components/Dialog/CustomDialog";
import { authAction } from "../../redux/reducers/auth";
import api_services from "../../services/api_services";
import AdminLayout from "./AdminLayout";
import AdminLoader from "./AdminLoader";
import { setFilterMenu } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

export const Product = () => {
  const { isAdmin } = useSelector((store) => store.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [productsData, setProductsData] = useState();
  const dispatch = useDispatch();

  const getProducts = async (catagory = "") => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("admin_token");
      const { data } = await api_services.allProducts(catagory, token);
      setProductsData(data);
      dispatch(authAction.isAdminExists());
    } catch (error) {
      dispatch(authAction.isAdminNotExists());
    } finally {
      setIsLoading(false);
    }
  };

  const openFilterMenu = () => {
    dispatch(setFilterMenu(true));
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (!isAdmin) return <Navigate to={"/admin"} />;
  return (
    <AdminLayout>
      <div className="products-container">
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
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <IoBagCheck size={25} />
                <p style={{ fontSize: 20 }}>All Products</p>
              </div>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#f5efe7",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={openFilterMenu}
              >
                <p>Filter</p>
                <CiFilter size={25} />
              </div>
            </div>
            <div
              style={{
                padding: 10,
                width: "100%",
                height: "92%",
                backgroundColor: "white",
                borderRadius: 10,
                marginTop: 10,
                overflow: "auto",
              }}
            >
              {productsData?.products?.map((item, index) => (
                <ProductItem
                  key={index}
                  _id={item._id}
                  productImage={item.productImage}
                  productName={item.productName}
                  currentBid={item.currentBid}
                  createdBy={item.createdBy}
                  startsIn={item.startsIn}
                  endsIn={item.endsIn}
                  getProducts={getProducts}
                />
              ))}
            </div>
          </>
        )}
        <TreeView
          categories={productsData?.categories}
          getProducts={getProducts}
        />
      </div>
    </AdminLayout>
  );
};

const ProductItem = ({
  _id,
  productName,
  productImage,
  currentBid,
  createdBy,
  startsIn,
  endsIn,
  getProducts,
}) => {
  const [open, setOpen] = useState(false);

  const deleteProductHandler = async () => {
    const toastId = toast.loading("Deleting Product...");
    try {
      const token = localStorage.getItem("admin_token");
      const { data } = await api_services.productDelete(_id, token);
      setOpen(false);
      toast.success(data.message, {
        id: toastId,
      });
      getProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
  };
  return (
    <>
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
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <img
              src={productImage}
              alt=""
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <p>{productName}</p>
            <p>
              Current bid : <span style={{ color: "red" }}>$ {currentBid}</span>
            </p>
            <p>
              Created By : <span style={{ color: "red" }}>{createdBy}</span>
            </p>
            <p>
              Start's In :{" "}
              <span style={{ color: "red" }}>
                {moment(startsIn).format("dddd, D MMMM YYYY")}
              </span>
            </p>
            <p>
              End's In :{" "}
              <span style={{ color: "red" }}>
                {moment(endsIn).format("dddd, D MMMM YYYY")}
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
          <RiDeleteBin5Fill size={25} />
          <p style={{ fontSize: 15 }}>Delete</p>
        </div>
      </div>
      <CustomDialog
        dialogTitle={"Are you want to Delete this product ?"}
        open={open}
        setOpen={setOpen}
        handler={deleteProductHandler}
      />
    </>
  );
};

const TreeView = ({ categories, getProducts }) => {
  const { isFilterMenu } = useSelector((store) => store.misc);
  const dispatch = useDispatch();
  const handleOnClose = () => {
    dispatch(setFilterMenu(false));
  };

  const onCatagoryClick = (catagory) => {
    getProducts(catagory);
    dispatch(setFilterMenu(false));
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        backgroundColor: "white",
        height: "100vh",
        width: 350,
        right: isFilterMenu ? 0 : "-50%",
        transition: "all 0.5s ease",
      }}
    >
      <div
        style={{
          height: 50,
          width: "100%",
          backgroundColor: "#f72c5b",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleOnClose}
        >
          <IoClose size={30} color="white" />
        </div>
        <h5 style={{ color: "white" }}>Search by Filter</h5>
      </div>
      <SimpleTreeView>
        {categories?.map((category, categoryIndex) => (
          <TreeItem
            key={`category-${categoryIndex}`}
            itemId={`category-${categoryIndex}`}
            label={category.category}
          >
            {category.genericNames?.map((genericName, genericIndex) => (
              <TreeItem
                key={`generic-${categoryIndex}-${genericIndex}`}
                itemId={`generic-${categoryIndex}-${genericIndex}`}
                label={genericName}
                onClick={() => onCatagoryClick(genericName)}
              />
            ))}
          </TreeItem>
        ))}
      </SimpleTreeView>
    </div>
  );
};
