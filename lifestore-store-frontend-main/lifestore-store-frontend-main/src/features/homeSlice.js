import { Alert } from '@mui/material';
import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  getHomeDataLoader: false,
  getHomeDataError: '',
   pendingCommission:0,
 totalSales:0,
totalInvoiceNumber:0
};

export const getHomeData = createAsyncThunk(
  'user/home',
  async ({params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`/api/home/store?${params}`,  config);
    

      
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
     if (error.response.status === 401 || error.response.status === 403) {
       dispatch(logout(error.response.data));
     }

      return rejectWithValue({ message: error.response.data.message });
    }
  }
);

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  extraReducers: {
    [getHomeData.pending]: (state) => {
      state.getHomeDataLoader= true
      state.getHomeDataError= ''
  
    },
    [getHomeData.fulfilled]: (state, action) => {
     
     state.getHomeDataLoader= false
  state.pendingCommission = action?.payload?.pendingCommission;
  state.totalSales = action?.payload?.totalSales;
  state.totalInvoiceNumber = action?.payload?.totalInvoiceNumber;
    },
    [getHomeData.rejected]: (state, action) => {
      state.loginLoader = false;
      state.user = {};
      state.token = '';
      state.loginError = action.payload?.message;
    },
  },
});

export default homeSlice.reducer;
