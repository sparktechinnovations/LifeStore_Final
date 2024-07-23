import { Alert } from '@mui/material';
import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  customers: [],
  customer: {},
  getCustomerError: '',
  getCustomerLoader: false,
  getCustomerSuccess: false,
  editCustomerError: '',
  editCustomerLoader: false,
  editCustomerSuccess: false,
  createCustomerError: '',
  createCustomerLoader: false,
  createCustomerSuccess: false,
  customerListLoader: false,
  customerListSuccess: false,
  customerListError: '',
  pages: 1,
  page: 1,
  documentCount: 0,
  limit: 10,
  order: 'asc',
  deleteCustomerLoader: false,
  deleteCustomerSuccess: false,
  deleteCustomerError: '',
  getDeletedCustomerLoader: false,
  getDeletedCustomerSuccess: false,
  getDeletedCustomerError: '',
  restoreCustomerLoader: false,
  restoreCustomerSuccess: false,
  restoreCustomerError: '',
};

export const customerList = createAsyncThunk(
  'customer/list',
  async ({ params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/customer?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customer/create',
  async ({ obj }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    console.log(obj);
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/customer`,
        { ...obj },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCustomer = createAsyncThunk(
  'customer/get',
  async ({ id }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/customer/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCustomer = createAsyncThunk(
  'customer/edit',
  async ({ id, obj }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `/api/customer/${id}`,
        { ...obj },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCustomers = createAsyncThunk(
  'customer/delete',
  async ({ idArray: selectedCustomerIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/customer/delete-many',
        { idArray: selectedCustomerIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(customerList({ params }));
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDeletedCustomer = createAsyncThunk(
  'customer/deleteList',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/customer?deleteStatus=${true}&${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const restoreCustomers = createAsyncThunk(
  'customer/restore',
  async ({ idArray: selectedCustomerIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/customer/restore-many`,
        { idArray: selectedCustomerIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(getDeletedCustomer({ params }));
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetEditCustomer: (state) => {
      state.editCustomerSuccess = false;
      state.editCustomerError = '';
    },
  },
  extraReducers: {
    [customerList.pending]: (state) => {
      state.customers = [];
      state.customerListError = '';
      state.customerListLoader = true;
      state.customerListSuccess = false;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.order = 'asc';
    },
    [customerList.fulfilled]: (state, action) => {
      state.customers = action.payload.customerList;
      state.customerListError = '';
      state.customerListLoader = false;
      state.customerListSuccess = true;
      state.documentCount = action.payload.documentCount;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.order = action.payload.order;
      state.sortType = action.payload.sortType;
      state.pages = Math.ceil(action.payload.documentCount / action.payload.limit);
    },
    [customerList.rejected]: (state, action) => {
      state.customers = [];
      state.customerListError = action.payload.message;
      state.customerListLoader = false;
      state.customerListSuccess = false;
    },
    [getCustomer.pending]: (state) => {
      state.customer = {};
      state.getCustomerLoader = true;
      state.getCustomerSuccess = false;
      state.getCustomerError = '';
    },
    [getCustomer.fulfilled]: (state, action) => {
      state.getCustomerLoader = false;
      state.getCustomerSuccess = true;
      state.getCustomerError = '';
      state.customer = action.payload;
    },
    [getCustomer.rejectWithValue]: (state, action) => {
      state.getCustomerLoader = false;
      state.getCustomerSuccess = false;
      state.getCustomerError = action.payload.message;
      state.customer = {};
    },
    [editCustomer.pending]: (state) => {
      state.customer = {};
      state.editCustomerLoader = true;
      state.editCustomerSuccess = false;
      state.editCustomerError = '';
    },
    [editCustomer.fulfilled]: (state, action) => {
      state.editCustomerLoader = false;
      state.editCustomerSuccess = true;
      state.editCustomerError = '';
      state.customer = action.payload;
    },
    [editCustomer.rejectWithValue]: (state, action) => {
      state.editCustomerLoader = false;
      state.editCustomerSuccess = false;
      state.editCustomerError = action.payload.message;
      state.customer = {};
    },
    [deleteCustomers.pending]: (state) => {
      state.deleteCustomerError = '';
      state.deleteCustomerLoader = true;
      state.deleteCustomersuccess = false;
    },
    [deleteCustomers.fulfilled]: (state, action) => {
      state.deleteCustomerError = '';
      state.deleteCustomerLoader = false;
      state.deleteCustomersuccess = true;
      state.deletedCustomers = action.payload.result || [...state.deletedCustomers];

      if (Array.isArray(state.deletedCustomers) && state.deletedCustomers.length > 0) {
        const deletedCustomerIds = state.deletedCustomers.map((Customer) => Customer._id);
        state.customers = state.customers?.filter((Customer) => !deletedCustomerIds.includes(Customer._id));
      }
    },
    [deleteCustomers.rejected]: (state, action) => {
      state.deleteCustomerError = action.error.message || 'Failed to delete Customers.';
      state.deleteCustomerLoader = false;
      state.deleteCustomersuccess = false;
    },

    [getDeletedCustomer.pending]: (state) => {
      state.getDeletedCustomerLoader = true;
      state.getDeletedCustomerSuccess = false;
      state.getDeletedCustomerError = '';
    },
    [getDeletedCustomer.fulfilled]: (state, action) => {
      state.getDeletedCustomerLoader = false;
      state.getDeletedCustomerSuccess = true;
      state.getDeletedCustomerError = '';
      state.customers = action.payload.customerList;
      state.documentCount = action.payload.documentCount;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.order = action.payload.order;
      state.sortType = action.payload.sortType;
      state.pages = Math.ceil(action.payload.documentCount / action.payload.limit);
    },
    [getDeletedCustomer.rejected]: (state) => {
      state.getDeletedCustomerLoader = false;
      state.getDeletedCustomerSuccess = false;
      state.getDeletedCustomerError = '';
    },
    [restoreCustomers.pending]: (state) => {
      state.restoreCustomerLoader = true;
      state.restoreCustomersuccess = false;
      state.restoreCustomerError = '';
    },
    [restoreCustomers.fulfilled]: (state, action) => {
      state.restoreCustomerLoader = false;
      state.restoreCustomersuccess = true;
      state.customers = action.payload.customerList;
      state.restoreCustomerError = '';
    },
    [restoreCustomers.rejected]: (state, action) => {
      state.restoreCustomerError = action.payload.message;
      state.restoreCustomerLoader = false;
      state.restoreCustomersuccess = false;
    },
    [createCustomer.pending]: (state) => {
      state.createCustomerLoader = true;
      state.createCustomerSuccess = false;
      state.createCustomerError = '';
    },
    [createCustomer.fulfilled]: (state, action) => {
      state.createCustomerLoader = false;
      state.createCustomerSuccess = true;
      state.customers = action.payload.customerList;
      state.createCustomerError = '';
    },
    [createCustomer.rejected]: (state, action) => {
      state.createCustomerError = action.payload.message;
      state.createCustomerLoader = false;
      state.createCustomerSuccess = false;
    },
  },
});

export const { resetEditCustomer } = customerSlice.actions;

export default customerSlice.reducer;
