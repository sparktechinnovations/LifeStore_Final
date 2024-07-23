
import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  invoices: [],
  invoice: {},
  deletedInvoices: [],
  invoiceListLoader: false,
  invoiceListError: '',
  pages: 1,
  page: 1,
  documentCount: 0,
  limit: 10,
  order: 'asc',
  deleteInvoiceLoader: false,
  deleteInvoicesuccess: false,
  deleteInvoiceError: '',
  getdeletedInvoicesLoader: false,
  getdeletedInvoicesSuccess: false,
  getdeletedInvoicesError: '',
  restoreInvoiceLoader: false,
  restoreInvoiceSuccess: false,
  restoreInvoiceError: '',
};

export const invoiceList = createAsyncThunk(
  'invoice/list',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/invoice?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
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



export const deleteInvoices = createAsyncThunk(
  'invoice/delete',
  async ({ id,params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.delete(
        `/api/invoice/${id}`,
       
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      dispatch(invoiceList({params}))
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

export const getdeletedInvoices = createAsyncThunk(
  'invoice/deleteList',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/invoice?deleteStatus=${true}&${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
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

export const restoreInvoices = createAsyncThunk(
  'invoice/restore',
  async ({ idArray: selectedinvoiceIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/invoice/restore-many`,
        { idArray: selectedinvoiceIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(getdeletedInvoices({ params }));
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

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    resetEditinvoice: (state) => {
      state.editinvoiceSuccess = false;
      state.editinvoiceError = '';
    },
    resetdeleteInvoice: (state) => {
      state.deleteInvoicesuccess = false;
      state.deleteInvoiceError = '';
    },
  },
  extraReducers: {
    [invoiceList.pending]: (state) => {
      state.invoices = [];
      state.invoiceListLoader = true;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.invoiceListError = '';
    },
    [invoiceList.fulfilled]: (state, action) => {
 
      state.invoices = action.payload?.invoiceList;
  
      state.invoiceListLoader = false;
      state.documentCount = action.payload?.documentCount;
      state.page = action.payload?.page;
      state.limit = action.payload?.limit;
      state.order = action.payload?.order;
      state.sortType = action.payload?.sortType;
      state.pages = Math.ceil(action.payload?.documentCount / action.payload?.limit);
      state.invoiceListError = '';
    },
    [invoiceList.rejected]: (state, action) => {
      state.invoices = [];
      state.invoiceListLoader = false;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.invoiceListError = action.payload?.message;
    },
    [deleteInvoices.pending]: (state) => {
      state.deleteInvoiceError = '';
      state.deleteInvoiceLoader = true;
      state.deleteInvoicesuccess = false;
    },
    [deleteInvoices.fulfilled]: (state, action) => {
      state.deleteInvoiceError = '';
      state.deleteInvoiceLoader = false;
      state.deleteInvoicesuccess = true;
      state.deletedInvoices = action.payload?.result || [...state.deletedInvoices];

      if (Array.isArray(state.deletedInvoices) && state.deletedInvoices.length > 0) {
        const deletedInvoiceIds = state.deletedInvoices.map((invoice) => invoice._id);
        state.invoices = state.invoices.filter((invoice) => !deletedInvoiceIds.includes(invoice._id));
      }
    },
    [deleteInvoices.rejected]: (state, action) => {
      state.deleteInvoiceError = action.error.message || 'Failed to delete invoices.';
      state.deleteInvoiceLoader = false;
      state.deleteInvoicesuccess = false;
    },

    [getdeletedInvoices.pending]: (state) => {
      state.getdeletedInvoicesLoader = true;
      state.getdeletedInvoicesSuccess = false;
      state.getdeletedInvoicesError = '';
    },
    [getdeletedInvoices.fulfilled]: (state, action) => {
      state.getdeletedInvoicesLoader = false;
      state.getdeletedInvoicesSuccess = true;
      state.getdeletedInvoicesError = '';
      state.invoices = action.payload?.invoiceList;
      state.documentCount = action.payload?.documentCount;
      state.page = action.payload?.page;
      state.limit = action.payload?.limit;
      state.order = action.payload?.order;
      state.sortType = action.payload?.sortType;
      state.pages = Math.ceil(action.payload?.documentCount / action.payload?.limit);
    },
    [getdeletedInvoices.rejected]: (state) => {
      state.getdeletedInvoicesLoader = false;
      state.getdeletedInvoicesSuccess = false;
      state.getdeletedInvoicesError = '';
    },
    [restoreInvoices.pending]: (state) => {
      state.restoreInvoiceLoader = true;
      state.restoreInvoiceSuccess = false;
      state.restoreInvoiceError = '';
    },
    [restoreInvoices.fulfilled]: (state, action) => {
      state.restoreInvoiceLoader = false;
      state.restoreInvoiceSuccess = true;
      state.invoices = action.payload?.invoiceList;
      state.restoreInvoiceError = '';
    },
    [restoreInvoices.rejected]: (state, action) => {
      state.restoreInvoiceError = action.payload?.message;
      state.restoreInvoiceLoader = false;
      state.restoreInvoiceSuccess = false;
    },
  },
});

export const { resetEditInvoice, resetDeleteInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
