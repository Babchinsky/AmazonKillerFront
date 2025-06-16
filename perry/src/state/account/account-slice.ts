import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkAndRefreshToken } from "../../utils/auth/authToken";
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
      const tokenValid = await checkAndRefreshToken();
      if (!tokenValid) return rejectWithValue("Token is invalid or expired");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile/me`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeName = createAsyncThunk(
  "account/changeName",
  async (
    data: { firstName: string; lastName: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile/name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      dispatch(getCurrentUser());
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "account/changePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const startEmailChange = createAsyncThunk(
  "account/startEmailChange",
  async (
    data: { newEmail: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile/email-change/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmEmailChange = createAsyncThunk(
  "account/confirmEmailChange",
  async (
    data: { code: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile/email-change/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      dispatch(getCurrentUser());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return;
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

      if (typeof action.payload === "string" && action.payload.includes("401")) {
        state.user = null;
      }
    });

    [
      changeName,
      changePassword,
      startEmailChange,
      confirmEmailChange,
      deleteAccount,
    ].forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(thunk.fulfilled, (state) => {
        state.loading = false;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    });
  },
});

export const { clearAccountState } = accountSlice.actions;
export default accountSlice.reducer;