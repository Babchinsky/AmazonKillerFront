import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CategoryType from "../../types/categories/category-type";
import CategoryTreeType from "../../types/categories/category-tree-type";
import CategoryFiltersType from "../../types/categories/category-filters-type";


type CategoriesState = {
  rootCategories: CategoryType[];
  categories: CategoryType[];
  categoryTree: CategoryTreeType[];
  categoryFilters: CategoryFiltersType | null;
  currentCategory: CategoryType | null;
  categoryExists: boolean | null;
};

const initialState: CategoriesState = {
  rootCategories: [],
  categories: [],
  categoryTree: [],
  categoryFilters: null,
  currentCategory: null,
  categoryExists: null
};

export const getRootCategories = createAsyncThunk(
  "categories/getRootCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/roots`,
        {}
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

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories`, 
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

export const getCategoryTree = createAsyncThunk(
  "categories/getCategoryTree",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/tree`,
        {}
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

export const getCategoryFilters = createAsyncThunk(
  "categories/getCategoryFilters",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${id}/filters`,
        {}
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      
      return await response.json();
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkCategoryExists = createAsyncThunk(
  "categories/checkCategoryExists",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${id}/exists`,
        {}
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "categories/getCategoryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${id}`,
        {}
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getRootCategories.fulfilled, (state, action) => {
      state.rootCategories = action.payload;
    })
    .addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    })
    .addCase(getCategoryTree.fulfilled, (state, action) => {
      state.categoryTree = action.payload;
    })
    .addCase(getCategoryFilters.fulfilled, (state, action) => {
      state.categoryFilters = action.payload;
    })
    .addCase(checkCategoryExists.fulfilled, (state, action) => {
      state.categoryExists = action.payload;
    })
    .addCase(getCategoryById.fulfilled, (state, action) => {
      state.currentCategory = action.payload;
    });
  }
}); 

export default categoriesSlice.reducer;