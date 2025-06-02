import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import OrderType from "../../types/account/orders/order-type";


type OrdersState = {
  orders: OrderType[];
  isLoading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.items as OrderType[]; // assuming paged list: { items: [], totalCount: ... }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;