import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
//import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
  },
});




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import cartReducer from './slices/cartSlice';
// import productReducer from './slices/productSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     cart: cartReducer,
//     products: productReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;





// import { configureStore } from '@reduxjs/toolkit';
// import cartReducer from './slices/cartSlice';
// import authReducer from './slices/authSlice';

// export const store = configureStore({
//   reducer: {
//     cart: cartReducer,
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;