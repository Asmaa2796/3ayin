// src/redux/SubCatsOfSubCategories.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("sub-categories");
// Initial state
const initialState = {
  subCatsOfSubCategories: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const SubCatsOfSubCategoriesSlice = createSlice({
  name: "subCatsOfSubCategories",
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
      key: "subCatsOfSubCategories",
    });
  },
});
// Export
export const { clearState } = SubCatsOfSubCategoriesSlice.actions;
export {
  fetchAll as fetchSubCatsOfSubCategories,
};
export default SubCatsOfSubCategoriesSlice.reducer;