import axios from "axios";
import { server } from "../components/constant/config";

const api_services = {
  login: async (payload) => {
    return await axios.post(`${server}/api/v1/auth/login`, payload, {
      withCredentials: true,
    });
  },
  register: async (payload) => {
    return await axios.post(`${server}/api/v1/auth/register`, payload, {
      withCredentials: true,
    });
  },
  verify: async (payload) => {
    return await axios.post(`${server}/api/v1/auth/verify`, payload, {
      withCredentials: true,
    });
  },
  profile: async (token) => {
    return await axios.get(`${server}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  logout: async (token) => {
    const payload = {
      token: token,
    };
    return await axios.post(`${server}/api/v1/auth/logout`, payload, {
      withCredentials: true,
    });
  },

  allProduct: async (token) => {
    return await axios.get(`${server}/api/v1/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  singleProduct: async (token, id) => {
    return await axios.get(`${server}/api/v1/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  addBid: async (bidAmount, token, id) => {
    const payload = {
      bidAmount: bidAmount,
    };
    return await axios.put(`${server}/api/v1/user/bid/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  addProduct: async (token, payload) => {
    return await axios.post(`${server}/api/v1/product/add`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  updateProfile: async (token, payload) => {
    return await axios.put(`${server}/api/v1/user/update-profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  filterProduct: async (catagories, genericName) => {
    return await axios.get(
      `${server}/api/v1/product/filter?catagory=${catagories}&genericName=${genericName}`,
      {
        withCredentials: true,
      }
    );
  },

  bookMarked: async (productId, token) => {
    const payload = {
      productId: productId,
    };
    return await axios.post(`${server}/api/v1/user/bookmarked`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  // Admin Api Services

  adminLoggedIn: async (secretKey) => {
    const payload = {
      secretKey: secretKey,
    };
    return await axios.post(`${server}/api/v1/admin/login`, payload, {
      withCredentials: true,
    });
  },

  checkAdmin: async (token) => {
    return await axios.get(`${server}/api/v1/admin/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  dashboardStats: async (token) => {
    return await axios.get(`${server}/api/v1/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  allUser: async (search, token) => {
    return await axios.get(`${server}/api/v1/admin/users?search=${search}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  allProducts: async (catagory, token) => {
    return await axios.get(
      `${server}/api/v1/admin/products?catagory=${catagory}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  },

  adminLogout: async (token) => {
    const payload = {
      token: token,
    };
    return await axios.post(`${server}/api/v1/admin/logout`, payload, {
      withCredentials: true,
    });
  },

  userLoggedOut: async (id, token) => {
    const payload = {
      id: id,
    };
    return await axios.post(`${server}/api/v1/admin/user/logout`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  productDelete: async (id, token) => {
    return await axios.delete(`${server}/api/v1/admin/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  userDelete: async (id, token) => {
    return await axios.delete(`${server}/api/v1/admin/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  resetPassword: async (email) => {
    const payload = {
      email: email,
    };
    return await axios.post(`${server}/api/v1/auth/reset-password`, payload, {
      withCredentials: true,
    });
  },

  verifyResetPassword: async (otp, token) => {
    const payload = {
      otp: otp,
    };
    return await axios.post(
      `${server}/api/v1/auth/reset-password/verfiy/${token}`,
      payload,
      {
        withCredentials: true,
      }
    );
  },

  updateUserPassword: async (newPassword, confirmPassword, token) => {
    const payload = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    return await axios.post(
      `${server}/api/v1/auth/change-password/${token}`,
      payload,
      {
        withCredentials: true,
      }
    );
  },

  checkToken: async (token) => {
    return await axios.get(`${server}/api/v1/auth/check-token/${token}`, {
      withCredentials: true,
    });
  },

  bidWinner: async (id, token) => {
    return await axios.get(`${server}/api/v1/product/winner/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  searchSuggestion: async (searchSuggestion) => {
    return await axios.get(
      `${server}/api/v1/product/search-suggestion?searchSuggestion=${searchSuggestion}`,
      {
        withCredentials: true,
      }
    );
  },

  addSearchSuggestion: async (searchSuggestion) => {
    const payload = {
      searchSuggestion: searchSuggestion,
    };
    return await axios.post(`${server}/api/v1/product/search-add`, payload, {
      withCredentials: true,
    });
  },

  allFilterProduct: async (suggestion, token) => {
    return axios.get(
      `${server}/api/v1/product/filterProduct?searchQuery=${suggestion}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  },

  addAmount: async (balance, token) => {
    const payload = {
      balance: Number(balance),
    };
    console.log(payload);
    return axios.post(`${server}/api/v1/user/add-balance`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  proceedToPay: async (amount, id, token) => {
    const payload = {
      amount: Number(amount),
    };
    return axios.post(`${server}/api/v1/user/payment/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  deniedPayment: async (id, token) => {
    return axios.get(`${server}/api/v1/user/payment-denied/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },
};

export default api_services;
