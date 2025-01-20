import React, { useCallback, useEffect, useState } from "react";

import { Header } from "../components/UI/Header";
import "./style.css";

import Boxes from "../components/UI/Boxes";

import SliderUI from "../components/UI/SliderUI";
import api_services from "../services/api_services";
import { useSocketEvent } from "../hooks/hook";
import { getSocket } from "../socket";
import toast from "react-hot-toast";

const Home = () => {
  const [products, setAllProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchSuggestion, setSearchSuggestion] = useState("");
  const socket = getSocket();

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api_services.allProduct(token);
      setAllProducts(data.products);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const addSearchHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api_services.addSearchSuggestion(searchSuggestion);
      const { data } = await api_services.allFilterProduct(
        searchSuggestion,
        token
      );
      setFilterProduct(data.products);
      setSearchSuggestion("");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, "Something went wrong");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    api_services.allFilterProduct(searchSuggestion, token).then(({ data }) => {
      setFilterProduct(data.products);
    });
  }, []);

  const newProductAddListener = useCallback((data) => {
    setAllProducts((prev) => [...prev, data]);
  });

  useEffect(() => {
    getProducts();
  }, []);

  const eventHandler = {
    ["PRODUCT_UPDATE"]: newProductAddListener,
  };

  useSocketEvent(socket, eventHandler);

  return (
    <div>
      <Header
        searchSuggestion={searchSuggestion}
        setSearchSuggestion={setSearchSuggestion}
        setFilterProduct={setFilterProduct}
        addSearchHandler={addSearchHandler}
      />
      <SliderUI products={products} />
      <div className="box-container">
        {filterProduct?.map((item) => (
          <Boxes
            key={item._id}
            id={item._id}
            name={item.productName}
            image={item.productImage}
            currentBid={item.currentBid}
            startsIn={item.startsIn}
            endsIn={item.endsIn}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
