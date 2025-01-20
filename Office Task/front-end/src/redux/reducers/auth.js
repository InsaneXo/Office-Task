import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAdmin: false,
    isLoading: true,
  },
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    isAdminExists: (state) => {
      state.isAdmin = true;
    },
    isAdminNotExists: (state) => {
      state.isAdmin = false;
    },
  },
});

export { authSlice };

export const authAction = authSlice.actions;
