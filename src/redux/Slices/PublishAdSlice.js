// src/redux/PublishAdSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll,
  create,
  getById,
  update
} = crudFactory("ad");
// Initial state
const initialState = {
  ad: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const PublishAdSlice = createSlice({
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
      fetchAll,
      create,
      getById,
      update,
      key: "ad",
    });
  },
});
// Export
export const { clearState } = PublishAdSlice.actions;
export {
  fetchAll as fetchAd,
  create as storeAd,
  getById as adRecord,
  update as updateRecord
};
export default PublishAdSlice.reducer;