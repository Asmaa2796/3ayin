// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("categories");
// Initial state
const initialState = {
  categories: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const SubCategoriesSlice = createSlice({
  name: "categories",
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
      key: "categories",
    });
  },
});
// Export
export const { clearState } = SubCategoriesSlice.actions;
export {
  fetchAll as fetchCategories,
};
export default SubCategoriesSlice.reducer;