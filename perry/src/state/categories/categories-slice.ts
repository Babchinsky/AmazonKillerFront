import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CategoryType from "../../types/category-type";


const initialState: any = {
  categories: []
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

      const data: CategoryType[] = await response.json();
      return data;
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
    .addCase(getCategories.pending, () => {
      console.log("getCategories pending");
    })
    .addCase(getCategories.fulfilled, (state, action) => {
      console.log("getCategories success");
      state.categories = action.payload;
    })
    .addCase(getCategories.rejected, () => {
      console.log("getCategories rejected");
    })
  }
}); 

export default categoriesSlice.reducer;