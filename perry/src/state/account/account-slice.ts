import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserType from "../../types/account/users/user-type";

type AccountStateType = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
};

const initialState: AccountStateType = {
  user: null,
  loading: false,
  error: null,
};

export const getCurrentUser = createAsyncThunk(
  "account/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountState(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearAccountState } = accountSlice.actions;
export default accountSlice.reducer;