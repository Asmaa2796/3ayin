// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  getById
} = crudFactory("ad");
// Initial state
const initialState = {
  ad: [],
  adItem: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const GetAdSlice = createSlice({
  name: "ad",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    addCrudExtraReducers(builder, {
      getById,
      key: "ad",
    });
  },
});
// Export
export const { clearState } = GetAdSlice.actions;
export {
  getById as getAdById,
};
export default GetAdSlice.reducer;