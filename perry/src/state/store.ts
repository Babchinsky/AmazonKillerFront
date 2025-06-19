import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth/auth-slice";
import accountSliceReducer from "./account/account-slice";
import categoriesSliceReducer from "./categories/categories-slice";
import productsSliceReducer from "./products/products-slice";
import wishlistSliceReducer from "./wishlist/wishlist-slice";
import cartSliceReducer from "./cart/cart-slice";
import ordersSliceReducer from "./orders/orders-slice";
import reviewsSliceReducer from "./reviews/reviews-slice";


export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    account: accountSliceReducer,
    categories: categoriesSliceReducer,
    products: productsSliceReducer,
    wishlist: wishlistSliceReducer,
    cart: cartSliceReducer,
    orders: ordersSliceReducer,
    reviews: reviewsSliceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;