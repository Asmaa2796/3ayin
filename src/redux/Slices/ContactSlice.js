// src/redux/ContactSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk for submitting the contact form
export const contactForm = createAsyncThunk(
  "contact/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/contact`, formData, {
        headers: {
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
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
const ContactSlice = createSlice({
  name: "contact",
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
      .addCase(contactForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(contactForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(contactForm.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      });
  },
});

// Exports
export const { clearState } = ContactSlice.actions;
export default ContactSlice.reducer;
