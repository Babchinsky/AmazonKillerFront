import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import OrderType from "../../types/account/orders/order-type";
import OrderDetailsType from "../../types/account/orders/order-details-type";


type OrderState = {
  orders: OrderType[];
  orderDetails: OrderDetailsType | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
};

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (
    params: { searchTerm?: string; status?: string; pageNumber?: number; pageSize?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams();

      if (params.searchTerm) {
        queryParams.append("searchTerm", params.searchTerm);
      }
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.pageNumber) {
        queryParams.append("parameters.pageNumber", params.pageNumber.toString());
      }
      if (params.pageSize) {
        queryParams.append("parameters.pageSize", params.pageSize.toString());
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/orders?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.items as OrderType[];
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data as OrderDetailsType;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const createdOrder = await response.json();
      return createdOrder as OrderDetailsType;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetails(state) {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase(getOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    })
    .addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    })
    .addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;