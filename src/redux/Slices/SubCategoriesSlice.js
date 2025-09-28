// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("sub-categories");
// Initial state
const initialState = {
  subcategories: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const SubCategoriesSlice = createSlice({
  name: "subcategories",
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
      key: "subcategories",
    });
  },
});
// Export
export const { clearState } = SubCategoriesSlice.actions;
export {
  fetchAll as fetchSubCategories,
};
export default SubCategoriesSlice.reducer;