import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProductCardType from "../../types/products/product-card-type";
import ProductType from "../../types/products/product-type";


type ProductsStateType = {
  products: ProductCardType[];
  productById: ProductType | null;
  categoryProducts: ProductCardType[];
  trendingProducts: ProductCardType[];
  saleProducts: ProductCardType[];
  productExists: boolean | null;
  categoryProductsLoading: boolean;
};

const initialState: ProductsStateType = {
  products: [],
  productById: null,
  categoryProducts: [],
  trendingProducts: [],
  saleProducts: [],
  productExists: null,
  categoryProductsLoading: false
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
        const errorData = await response.json();
        return rejectWithValue(errorData);
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
        const errorData = await response.json();
        return rejectWithValue(errorData);
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
  async (
    params: { categoryId: string; filters?: { [key: string]: string[] } },
    { rejectWithValue }
  ) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("categoryId", params.categoryId);

      const plainKeys = ["minPrice", "maxPrice", "rating"];

      if (params.filters) {
        for (const [key, values] of Object.entries(params.filters)) {
          const paramName = plainKeys.includes(key)
              ? key
              : `Filters[${key}]`;

          values.forEach(val => urlParams.append(paramName, val));
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products?${urlParams.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
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
        const errorData = await response.json();
        return rejectWithValue(errorData);
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
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result.items;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkProductExists = createAsyncThunk(
  "products/checkProductExists",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}/exists`,
        {}
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const exists = await response.json();
      return exists;
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
    .addCase(getProductsByCategory.pending, (state) => {
      state.categoryProductsLoading = true;
    })
    .addCase(getProductsByCategory.fulfilled, (state, action) => {
      state.categoryProducts = action.payload;
      state.categoryProductsLoading = false;
    })
    .addCase(getProductsByCategory.rejected, (state) => {
      state.categoryProductsLoading = false;
    })
    .addCase(getTrendingProducts.fulfilled, (state, action) => {
      state.trendingProducts = action.payload;
    })
    .addCase(getSaleProducts.fulfilled, (state, action) => {
      state.saleProducts = action.payload;
    })
    .addCase(checkProductExists.fulfilled, (state, action) => {
      state.productExists = action.payload;
    });
  }
});

export default productsSlice.reducer;