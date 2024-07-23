import { configureStore } from '@reduxjs/toolkit';

import authReducer  from '../features/authSlice';

import storeReducer from '../features/storeSlice';

import productReducer from '../features/productSlice';
import homeReducer from '../features/homeSlice';
import invoiceReducer from '../features/invoiceSlice';

const store = configureStore({
  reducer: {
    auth:authReducer,
    store:storeReducer,
    product:productReducer,
    home:homeReducer,
    invoice:invoiceReducer,
  },

});

export default store;
