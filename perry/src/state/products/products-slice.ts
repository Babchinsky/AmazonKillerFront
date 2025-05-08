import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProductType from "../../types/product-type";


const initialState: any = {
  products: [],
  productsByCategory: []
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products`, 
        {}
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ProductType[] = await response.json();
      return data;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  "products/getProductsByCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products?categoryId=${categoryId}`,
        {}
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ProductType[] = await response.json();
      return data;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getProducts.pending, () => {
      console.log("getProducts pending");
    })
    .addCase(getProducts.fulfilled, (state, action) => {
      console.log("getProducts success");
      state.products = action.payload;
    })
    .addCase(getProducts.rejected, () => {
      console.log("getProducts rejected");
    })

    .addCase(getProductsByCategory.pending, () => {
      console.log("getProductsByCategory pending");
    })
    .addCase(getProductsByCategory.fulfilled, (state, action) => {
      console.log("getProductsByCategory success");
      state.productsByCategory = action.payload;
    })
    .addCase(getProductsByCategory.rejected, () => {
      console.log("getProductsByCategory rejected");
    });
  }
}); 

export default productsSlice.reducer;