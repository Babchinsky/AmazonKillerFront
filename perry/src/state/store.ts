import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth/auth-slice";
import accountSliceReducer from "./account/account-slice";
import categoriesSliceReducer from "./categories/categories-slice";
import productsSliceReducer from "./products/products-slice";
import ordersSliceReducer from "./orders/order-slice";


export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    account: accountSliceReducer,
    categories: categoriesSliceReducer,
    products: productsSliceReducer,
    orders: ordersSliceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;