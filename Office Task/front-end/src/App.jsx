import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../src/components/Loader/Loader";
import { Toaster } from "react-hot-toast";

import "./App.css";
import SingleBid from "./pages/SingleBid";
import PageNotFound from "./pages/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import api_services from "./services/api_services";
import { authAction } from "./redux/reducers/auth";
import Profile from "./pages/Profile";
import { SocketProvider } from "./socket";
import Dashboard from "./pages/admin/Dashboard";
import { Product } from "./pages/admin/Product";
import User from "./pages/admin/User";
import AdminLogin from "./pages/admin/AdminLogin";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { user, isLoading } = useSelector((store) => store.auth);

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

  useEffect(() => {
    onLoadUser();
  }, [isLoading]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  return (
    <div className="main">
      {isLoading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectedRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bid/:id" element={<SingleBid />} />
            </Route>

            <Route element={<ProtectedRoute user={!user} redirect="/" />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>

            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<Product />} />
            <Route path="/admin/users" element={<User />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster position="bottom-center" />
        </BrowserRouter>
      )}
    </div>
  );
};

export default App;
