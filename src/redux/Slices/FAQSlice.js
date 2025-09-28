// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("faqs");
// Initial state
const initialState = {
  faqs: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const FAQSlice = createSlice({
  name: "faqs",
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
      key: "faqs",
    });
  },
});
// Export
export const { clearState } = FAQSlice.actions;
export {
  fetchAll as fetchFaqs,
};
export default FAQSlice.reducer;