import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


type AuthStateType = {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthStateType = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  userEmail: null,
  userFirstName: null,
  userLastName: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string; deviceId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

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

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/profile/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerStart = createAsyncThunk(
  "auth/registerStart",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register/start`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerConfirm = createAsyncThunk(
  "auth/registerConfirm",
  async (data: { email: string; code: string; deviceId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register/confirm`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(data)
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action: any) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.userEmail = null;
      state.userFirstName = null;
      state.userLastName = null;
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(registerStart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerStart.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(registerStart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(registerConfirm.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerConfirm.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(registerConfirm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default authSlice.reducer;