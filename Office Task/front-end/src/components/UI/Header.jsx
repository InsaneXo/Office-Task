import { AiOutlineMenu } from "react-icons/ai";
import { IoSearch, IoClose } from "react-icons/io5";
import { TbFilterSearch } from "react-icons/tb";

import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setIsMenu } from "../../redux/reducers/misc";
import api_services from "../../services/api_services";
import MenuBar from "./MenuBar";
import "./style.css";
import toast from "react-hot-toast";

export const Header = ({
  searchSuggestion,
  setSearchSuggestion,
  setFilterProduct,
  addSearchHandler,
}) => {
  const { isMenu } = useSelector((store) => store.misc);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [catagoriesData, setCatagoriesData] = useState([]);
  const [catagories, setCatagories] = useState("");
  const [genericName, setGenericName] = useState("");
  const [searchSuggestionData, setSearchSuggestionData] = useState();

  const [genericIndex, setGenericIndex] = useState(0);
  const [isFilterResultVisible, setIsFilterResultVisible] = useState(false);
  const searchRef = useRef(null);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    dispatch(setIsMenu(!isMenu));
  };
  const toggleToProfile = () => {
    navigate("/profile");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchSuggestion("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isFilterResultVisible) return;
    setIsLoading(true);
    api_services
      .filterProduct(catagories, genericName)
      .then(({ data }) => {
        setProducts(data.products);
        setCatagoriesData(data.catagories);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [catagories, genericName, isFilterResultVisible]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      api_services.searchSuggestion(searchSuggestion).then(({ data }) => {
        setSearchSuggestionData(data.search);
      });
    }, 1000);

    return () => clearTimeout(timerId);
  }, [searchSuggestion]);

  return (
    <>
      <div className="header" ref={searchRef}>
        <div onClick={() => toggleMenu()}>
          <AiOutlineMenu size={25} cursor={"pointer"} />
        </div>
        <div className="search-bar">
          <div
            style={{
              height: 50,
              width: isFilterResultVisible ? 50 : 170,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f72c5b",
              color: "white",
              padding: "0px 10px",
              borderRadius: isFilterResultVisible ? "50%" : 29,
              gap: 5,
              cursor: "pointer",
              transition: "all 0.3s ease",
              overflow: "hidden",
            }}
            onClick={() =>
              isFilterResultVisible
                ? setIsFilterResultVisible(false)
                : setIsFilterResultVisible(true)
            }
          >
            {isFilterResultVisible ? (
              <IoClose size={20} color="white" />
            ) : (
              <>
                <p>Search By Filter</p>
                <TbFilterSearch size={20} color="white" />
              </>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", position: "relative" }}>
            <form
              onSubmit={addSearchHandler}
              style={{ display: "flex", flex: 1 }}
            >
              <input
                type="text"
                placeholder="Search Product ..."
                value={searchSuggestion}
                onChange={(e) => setSearchSuggestion(e.target.value)}
              />
            </form>
            <div style={{ position: "absolute", right: 9, top: 16 }}>
              <IoSearch size={20} color="grey" />
            </div>
          </div>
          {isFilterResultVisible && (
            <SearchResultBox
              products={products}
              isLoading={isLoading}
              genericName={genericName}
              setCatagories={setCatagories}
              setGenericName={setGenericName}
              catagoriesData={catagoriesData}
              genericIndex={genericIndex}
              setGenericIndex={setGenericIndex}
              catagories={catagories}
            />
          )}
          {searchSuggestion && !searchSuggestion.includes(" ") && (
            <SearchSuggestionResultBox
              searchSuggestionData={searchSuggestionData}
              setFilterProduct={setFilterProduct}
              setSearchSuggestion={setSearchSuggestion}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={toggleToProfile}
          >
            <FaUser size={25} cursor={"pointer"} />
            <p style={{ fontSize: 15 }}>{user?.displayName}</p>
          </div>
        </div>
      </div>

      <MenuBar toggleMenu={toggleMenu} />
    </>
  );
};

const SearchResultBox = ({
  products,
  isLoading,
  genericName,
  catagories,
  catagoriesData,
  setGenericName,
  setCatagories,
  genericIndex,
  setGenericIndex,
}) => {
  const handleCatagories = (index, e) => {
    setGenericIndex(index);
    setCatagories(e.target.value);
    setGenericName(catagoriesData[index]?.genericNames[0]);
  };

  const handleGenericName = (e) => {
    setGenericName(e.target.value);
  };

  return (
    <div
      style={{
        width: "98%",
        height: 500,
        backgroundColor: "white",
        position: "absolute",
        top: 56,
        borderRadius: 10,
        boxShadow: "rgba(0, 0, 0, 0.3) 2px 5px 12px 5px",
        padding: 6,
        transition: "all 0.5s ease",
        zIndex: 99,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 70,
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 4,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <IoSearch size={25} />
            <p style={{ fontSize: 15 }}>Search By Filter</p>
          </div>
          <div>
            <select
              style={{
                padding: 10,
                outline: "none",
                borderRadius: 10,
                backgroundColor: "white",
                border: "1px solid gray",
                marginRight: 5,
              }}
              value={catagories}
              onChange={(e) =>
                handleCatagories(
                  catagoriesData.findIndex(
                    (item) => item.category === e.target.value
                  ),
                  e
                )
              }
            >
              <option value="" onClick={() => setGenericName("")}>
                All
              </option>
              {catagoriesData?.map((item, index) => (
                <option key={index} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>
            {catagories && (
              <select
                style={{
                  padding: 10,
                  outline: "none",
                  borderRadius: 10,
                  backgroundColor: "white",
                  border: "1px solid gray",
                }}
                value={genericName}
                onChange={handleGenericName}
              >
                {catagoriesData[genericIndex]?.genericNames.map(
                  (item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            )}
          </div>
        </div>
      </div>
      <div style={{ width: "100%", height: "85%", overflow: "auto" }}>
        {products?.length === 0 ? (
          <div style={{ margin: 20 }}>
            <p style={{ textAlign: "center" }}>
              Such Products are not available
            </p>
          </div>
        ) : isLoading ? (
          <CssLoader />
        ) : (
          products
            ?.sort((a, b) => a.productName.localeCompare(b.productName))
            .map((item) => (
              <SearchItem
                key={item._id}
                _id={item._id}
                productImage={item.productImage}
                productName={item.productName}
                currentBid={item.currentBid}
              />
            ))
        )}
      </div>
    </div>
  );
};
const SearchSuggestionResultBox = ({
  searchSuggestionData,
  setFilterProduct,
  setSearchSuggestion,
}) => {
  return (
    <div
      style={{
        width: "98%",
        height: 450,
        backgroundColor: "white",
        position: "absolute",
        top: 56,
        borderRadius: 10,
        boxShadow: "rgba(0, 0, 0, 0.3) 2px 5px 12px 5px",
        padding: 6,
        transition: "all 0.5s ease",
        zIndex: 99,
        overflow: "auto",
      }}
    >
      <div style={{ width: "100%" }}>
        {searchSuggestionData &&
          searchSuggestionData.map((item) => (
            <SearchSuggestionItem
              key={item._id}
              name={item.searchSuggestion}
              setFilterProduct={setFilterProduct}
              setSearchSuggestion={setSearchSuggestion}
            />
          ))}
      </div>
    </div>
  );
};

const SearchItem = ({ _id, productName, currentBid, productImage }) => {
  return (
    <Link
      to={`/bid/${_id}`}
      style={{
        width: "100%",
        height: 70,
        backgroundColor: "#f5efe7",
        borderRadius: 10,
        overflow: "hidden",
        padding: "5px 10px",
        marginBottom: 5,
        cursor: "pointer",
        display: "flex",
        gap: 10,
        textDecoration: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: 65,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <img
          src={productImage}
          alt=""
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </div>
      <div>
        <p style={{ color: "black" }}>{productName}</p>
        <p style={{ color: "red" }}>$ {currentBid}</p>
      </div>
    </Link>
  );
};

const SearchSuggestionItem = ({
  name,
  setFilterProduct,
  setSearchSuggestion,
}) => {
  const clickHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.allFilterProduct(name, token);
      setFilterProduct(data.products);
      setSearchSuggestion("");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      style={{
        height: 60,
        width: "100%",
        backgroundColor: "#f5efe7",
        padding: 4,
        display: "flex",
        alignItems: "center",
        gap: 5,
        borderRadius: 8,
        marginBottom: 3,
        cursor: "pointer",
      }}
      onClick={clickHandler}
    >
      <div
        style={{
          height: "100%",
          width: 50,
          backgroundColor: "#f72c5b",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          color: "white",
        }}
      >
        <IoSearch size={20} />
      </div>
      <p>{name}</p>
    </div>
  );
};
const CssLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="loader"></div>
      {/* Injecting the CSS for the loader */}
      <style>
        {`
          .loader {
            width: 50px;
            padding: 8px;
            aspect-ratio: 1;
            border-radius: 50%;
            background: #25b09b;
            --_m: 
              conic-gradient(#0000 10%,#000),
              linear-gradient(#000 0 0) content-box;
            -webkit-mask: var(--_m);
                    mask: var(--_m);
            -webkit-mask-composite: source-out;
                    mask-composite: subtract;
            animation: l3 1s infinite linear;
          }

          @keyframes l3 {
            to {
              transform: rotate(1turn);
            }
          }
        `}
      </style>
    </div>
  );
};
