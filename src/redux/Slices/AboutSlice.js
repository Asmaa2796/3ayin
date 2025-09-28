// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("about-us");
// Initial state
const initialState = {
  aboutus: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const AboutSlice = createSlice({
  name: "aboutus",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    addCrudExtraReducers(builder, {
      fetchAll,
      key: "aboutus",
    });
  },
});
// Export
export const { clearState } = AboutSlice.actions;
export {
  fetchAll as fetchAbout,
};
export default AboutSlice.reducer;