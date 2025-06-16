import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ReviewType from "../../types/account/reviews/review-type";


type ReviewsStateType = {
  reviews: ReviewType[];
  reviewById: ReviewType | null;
  loading: boolean;
  error: string | null;
  hasInitialized: boolean;
};

const initialState: ReviewsStateType = {
  reviews: [],
  reviewById: null,
  loading: false,
  error: null,
  hasInitialized: false,
};

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (
    params: {
      filters?: {
        productId?: string;
        userId?: string;
        minRating?: number;
        maxRating?: number;
        [key: string]: string | number | undefined;
      };
    }, { rejectWithValue }
  ) => {
    try {
      const urlParams = new URLSearchParams();

      if (params.filters) {
        for (const [key, value] of Object.entries(params.filters)) {
          if (value !== undefined && value !== null) {
            urlParams.append(key, value.toString());
          }
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews?${urlParams.toString()}`
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

export const getReviewById = createAsyncThunk(
  "reviews/getReviewById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${id}`,
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

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getReviews.fulfilled, (state, action) => {
      state.reviews = action.payload;
      state.loading = false;
      state.hasInitialized = true;
    })
    .addCase(getReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(getReviewById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getReviewById.fulfilled, (state, action) => {
      state.reviewById = action.payload;
      state.loading = false;
    })
    .addCase(getReviewById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default reviewsSlice.reducer;