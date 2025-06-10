import { configureStore } from "@reduxjs/toolkit";
import categoriesSliceReducer from "./categories/categories-slice";
import productsSliceReducer from "./products/products-slice";


export const store = configureStore({
  reducer: {
    categories: categoriesSliceReducer,
    products: productsSliceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;