import { Alert } from '@mui/material';
import axios from './axios/axios';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  loginLoader: false,
  user: localStorage.getItem('storeinfo') ? JSON.parse(localStorage.getItem('storeinfo')).store : {},
  token: localStorage.getItem('storeinfo') ? JSON.parse(localStorage.getItem('storeinfo')).token : '',
  loginError: '',
  error: '',
};

export const login = createAsyncThunk(
  'user/login',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post('/api/store/login', { ...obj }, config);
      const { store, token } = response.data;

      localStorage.setItem('storeinfo', JSON.stringify({ store, token }));
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      return rejectWithValue({ message: error.response.data.message });
    }
  }
);

export const sendOtp = createAsyncThunk(
  'sendOtp',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    console.log(obj);
    try {
      const response = await axios.post(`/api/admin/send-otp`,
      { ...obj },
       {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        
        return rejectWithValue({ message: 'Network Error! Try Refreshing page! If problem persists, please Contact Support!' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem('storeinfo');
      state.loginLoader = false;
      state.user = {};
      state.token = '';
      state.loginError = '';
      if (action.payload?.message) state.error = action.payload?.message;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loginLoader = true;
      state.user = {};
      state.token = '';
      state.loginError = '';
      state.error = '';
    },
    [login.fulfilled]: (state, action) => {
      state.loginLoader = false;
      state.user = action.payload.store;
      state.token = action.payload?.token;
      state.loginError = '';
    },
    [login.rejected]: (state, action) => {
      state.loginLoader = false;
      state.user = {};
      state.token = '';
      state.loginError = action.payload?.message;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
