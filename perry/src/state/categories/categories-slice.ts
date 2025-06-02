import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CategoryType from "../../types/categories/category-type";
// import CategoryTreeType from "../../types/categories/category-tree-type";
// import CategoryFiltersType from "../../types/categories/category-filters-type";


type CategoriesState = {
  categories: CategoryType[];
  // categoryTree: CategoryTreeType[];
  // categoryFilters: CategoryFiltersType | null;
};

const initialState: CategoriesState = {
  categories: [],
  // categoryTree: [],
  // categoryFilters: null
};

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories`, 
        {}
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: CategoryType[] = await response.json();
      return result;
    } 
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const getCategoryTree = createAsyncThunk(
//   "categories/getCategoryTree",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/tree`);
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const result: CategoryTreeType[] = await response.json();
//       return result;
//     } 
//     catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// 
// export const getCategoryFilters = createAsyncThunk(
//   "categories/getCategoryFilters",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${id}/filters`);
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const result: CategoryFiltersType = await response.json();
//       return result;
//     } 
//     catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    // .addCase(getCategoryTree.fulfilled, (state, action) => {
    //   state.categoryTree = action.payload;
    // })
    // .addCase(getCategoryFilters.fulfilled, (state, action) => {
    //   state.categoryFilters = action.payload;
    // });
  }
}); 

export default categoriesSlice.reducer;