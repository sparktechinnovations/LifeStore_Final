import { configureStore } from '@reduxjs/toolkit';

import authReducer  from '../features/authSlice';

import adminReducer from '../features/adminSlice';

import agentReducer from '../features/agentSlice';

import customerReducer from '../features/customerSlice';

import storeReducer from '../features/storeSlice';

import productReducer from '../features/productSlice';
import homeReducer from '../features/homeSlice';
import invoiceReducer from '../features/invoiceSlice';

const store = configureStore({
  reducer: {
    auth:authReducer,
    admin:adminReducer,
    agent:agentReducer,
    customer:customerReducer,
    store:storeReducer,
    product:productReducer,
    home:homeReducer,
    invoice:invoiceReducer,
  },

});

export default store;
