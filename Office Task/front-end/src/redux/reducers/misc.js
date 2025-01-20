import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMenu: false,
  isEditDialog: false,
  isAddProductDialog: false,
  isFilterMenu: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsMenu: (state, action) => {
      state.isMenu = action.payload;
    },
    setIsEditDialog: (state, action) => {
      state.isEditDialog = action.payload;
    },
    setIsAddProductDialog: (state, action) => {
      state.isAddProductDialog = action.payload;
    },
    setFilterMenu: (state, action) => {
      state.isFilterMenu = action.payload;
    },
  },
});

export default miscSlice;

export const {
  setIsMenu,
  setIsEditDialog,
  setIsAddProductDialog,
  setFilterMenu,
} = miscSlice.actions;
