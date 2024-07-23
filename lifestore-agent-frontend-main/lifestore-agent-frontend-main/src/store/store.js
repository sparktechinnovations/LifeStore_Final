import { configureStore } from '@reduxjs/toolkit';

import authReducer  from '../features/authSlice';


import agentReducer from '../features/agentSlice';

import customerReducer from '../features/customerSlice';


import homeReducer from '../features/homeSlice';

import invoiceReducer from '../features/invoiceSlice';

const store = configureStore({
  reducer: {
    auth:authReducer,

    agent:agentReducer,
    customer:customerReducer,
 
    home:homeReducer,
    invoice:invoiceReducer
  },

});

export default store;
