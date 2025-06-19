import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  selectedFilters: { [filterName: string]: string[] };
  minPrice: number | null;
  maxPrice: number | null;
  selectedRatings: number[];
}

const initialState: FiltersState = {
  selectedFilters: {},
  minPrice: null,
  maxPrice: null,
  selectedRatings: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters(state, action: PayloadAction<{ [key: string]: string[] }>) {
      state.selectedFilters = action.payload;
    },
    updateFilter(state, action: PayloadAction<{ filterName: string; values: string[] }>) {
      const { filterName, values } = action.payload;
      if (values.length > 0) {
        state.selectedFilters[filterName] = values;
      } else {
        delete state.selectedFilters[filterName];
      }
    },
    clearFilters(state) {
      state.selectedFilters = {};
      state.minPrice = null;
      state.maxPrice = null;
      state.selectedRatings = [];
    },
    setMinPrice(state, action: PayloadAction<number | null>) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<number | null>) {
      state.maxPrice = action.payload;
    },
    setSelectedRatings(state, action: PayloadAction<number[]>) {
      state.selectedRatings = action.payload;
    },
  },
});

export const {
  setSelectedFilters,
  updateFilter,
  clearFilters,
  setMinPrice,
  setMaxPrice,
  setSelectedRatings,
} = filtersSlice.actions;

export default filtersSlice.reducer;
