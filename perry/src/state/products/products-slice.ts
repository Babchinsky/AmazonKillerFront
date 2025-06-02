import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProductCardType from "../../types/products/product-card-type";
import ProductType from "../../types/products/product-type";


type ProductsStateType = {
  products: ProductCardType[];
  productById: ProductType | null;
  categoryProducts: ProductCardType[];
  trendingProducts: ProductCardType[];
  saleProducts: ProductCardType[];
};

const initialState: ProductsStateType = {
  products: [],
  productById: null,
  categoryProducts: [],
  trendingProducts: [],
  saleProducts: []
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

      const result = await response.json();
      return result.items;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}`, 
        {}
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: ProductType = await response.json();
      return result;
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

      const result = await response.json();
      return result.items;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTrendingProducts = createAsyncThunk(
  "products/getTrendingProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products?isTrending=true`, 
        {}
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.items;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSaleProducts = createAsyncThunk(
  "products/getSaleProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products?discountPercent_gte=1`, 
        {}
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.items;
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
    .addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    })
    .addCase(getProductById.fulfilled, (state, action) => {
      state.productById = action.payload;
    })
    .addCase(getProductsByCategory.fulfilled, (state, action) => {
      state.categoryProducts = action.payload;
    })
    .addCase(getTrendingProducts.fulfilled, (state, action) => {
      state.trendingProducts = action.payload;
    })
    .addCase(getSaleProducts.fulfilled, (state, action) => {
      state.saleProducts = action.payload;
    });
  }
}); 

export default productsSlice.reducer;