// src/redux/UserIdentifiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const storeUserIdentifies = createAsyncThunk(
  "userIdentifies/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;

      const response = await axios.post(
        `${BASE_URL}/api/profile/identifies/store`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit contact form"
      );
    }
  }
);

// Initial state
const initialState = {
  isLoading: false,
  success: null,
  error: null,
};

// Slice
const UserIdentifiesSlice = createSlice({
  name: "userIdentifies",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeUserIdentifies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(storeUserIdentifies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(storeUserIdentifies.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      });
  },
});

// Exports
export const { clearState } = UserIdentifiesSlice.actions;
export default UserIdentifiesSlice.reducer;
