import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CartItemType from "../../types/account/cart/cart-item-type";


type CartState = {
  items: CartItemType[];
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result as CartItemType[];
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return true;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return { productId, quantity };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return productId;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(getCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(addProductToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(updateProductQuantity.fulfilled, (state, action) => {
      //
    })
    .addCase(removeProductFromCart.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;