
import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  stores: [],
  store: {},
  getStoreError: '',
  getStoreLoader: false,
  getStoreSuccess: false,
  totalCommissions:{},
  editStoreError: '',
  editStoreLoader: false,
  editStoreSuccess: false,
  createStoreError: '',
  createStoreLoader: false,
  createStoreSuccess: false,
  storeListLoader: false,
  storeListSuccess: false,
  storeListError: '',
  pages: 1,
  page: 1,
  documentCount: 0,
  limit: 10,
  order: 'asc',
  deleteStoreLoader: false,
  deleteStoreSuccess: false,
  deleteStoreError: '',
  getDeletedStoreLoader: false,
  getDeletedStoreSuccess: false,
  getDeletedStoreError: '',
  restoreStoreLoader: false,
  restoreStoreSuccess: false,
  restoreStoreError: '',
  storeCommissionLoader: false,
  storeCommissionSuccess: true,
  storeCommissionError: '',
  getStoreCommissionLoader: false,
  getStoreCommissionSuccess: false,
  getStoreCommissionError: false,
  dateList: [],
  storeCommisions: [],
  payments: [],
  getStorePaymentsSuccess: false,
  getStorePaymentsError: '',
  getStorePaymentsLoader: false,
  sortType: '',
  getStoreNamesError: '',
  getStoreNamesLoader: false,
  getStoreNamesSuccess: false,
  postStorePaymentsSuccess: false,
  postStorePaymentsError: '',
  postStorePaymentsLoader: false,
};

export const storeList = createAsyncThunk(
  'store/list',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/store?${params}`, {
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

export const getStoreNames = createAsyncThunk(
  'agent/names',
  async ({ search }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/store?search=${search}`, {
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

export const getStore = createAsyncThunk(
  'store/get',
  async ({ id }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/store/${id}`, {
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

export const editStore = createAsyncThunk(
  'store/edit',
  async ({ id, obj }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `/api/store/${id}`,
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
  return rejectWithValue({ message: 'Network Error! Try Refreshing page! If problem persists, please Contact Support!' });
      }
      
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout(error.response.data));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteStores = createAsyncThunk(
  'store/delete',
  async ({ idArray: selectedStoreIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/store/delete-many',
        { idArray: selectedStoreIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(storeList({ params }));
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

export const getDeletedStore = createAsyncThunk(
  'store/deleteList',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/store?deleteStatus=${true}&${params}`, {
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

export const createStore = createAsyncThunk(
  'store/create',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(`/api/store`, obj, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

export const restoreStores = createAsyncThunk(
  'store/restore',
  async ({ idArray: selectedStoreIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/store/restore-many`,
        { idArray: selectedStoreIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(getDeletedStore());
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

export const storeCommissionList = createAsyncThunk(
  'store/commissions',
  async ({ params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/commission/store-commissions?${params}`, {
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

export const storeDocumentDelete = createAsyncThunk(
  'document/delete',
  async ({ key }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/store/document/${encodeURIComponent(key)}`, {
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

export const getStoreCommission = createAsyncThunk(
  'store/commission',
  async ({ id, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/commission/store-commissions/${id}?${params}`, {
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

export const getStorePayments = createAsyncThunk(
  'store/payments',
  async ({ params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`api/commission/payment/store?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });
     
      return fulfillWithValue(response.data);
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

export const postStorePayments = createAsyncThunk(
  'store/payments-post',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
     
      const { auth } = getState();
      const response = await axios.post(
        `api/commission/store-commissions/${obj.store}`,
        { ...obj },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      
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

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    resetEditStore: (state) => {
      state.editStoreSuccess = false;
      state.editStoreError = '';
    },
  },
  extraReducers: {
    [storeList.pending]: (state) => {
      state.stores = [];
      state.storeListError = '';
      state.storeListLoader = true;
      state.storeListSuccess = false;
    },
    [storeList.fulfilled]: (state, action) => {
      state.stores = action?.payload?.storeList;
      
      state.totalCommissions=action?.payload?.totalCommissions;
      state.storeListError = '';
      state.storeListLoader = false;
      state.storeListSuccess = true;
      state.documentCount = action?.payload?.documentCount;
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [storeList.rejected]: (state, action) => {
      state.stores = [];
      state.storeListError = action.payload?.message;
      state.storeListLoader = false;
      state.storeListSuccess = false;
    },
    [getStore.pending]: (state) => {
      state.store = {};
      state.getStoreLoader = true;
      state.getStoreSuccess = false;
      state.getStoreError = '';
    },
    [getStore.fulfilled]: (state, action) => {
      state.getStoreLoader = false;
      state.getStoreSuccess = true;
      state.getStoreError = '';
      state.store = action.payload;
    },
    [getStore.rejected]: (state, action) => {
      state.getStoreLoader = false;
      state.getStoreSuccess = false;
      state.getStoreError = action?.payload?.message;
      state.store = {};
    },
    [editStore.pending]: (state) => {
      state.store = {};
      state.editStoreLoader = true;
      state.editStoreSuccess = false;
      state.editStoreError = '';
    },
    [editStore.fulfilled]: (state, action) => {
      state.editStoreLoader = false;
      state.editStoreSuccess = true;
      state.editStoreError = '';
      state.store = action.payload;
    },
    [editStore.rejected]: (state, action) => {
      state.editStoreLoader = false;
      state.editStoreSuccess = false;
      state.editStoreError = action?.payload?.message;
      state.store = {};
    },
    [createStore.pending]: (state) => {
      state.store = {};
      state.createStoreLoader = true;
      state.createStoreSuccess = false;
      state.createStoreError = '';
    },
    [createStore.fulfilled]: (state, action) => {
      state.createStoreLoader = false;
      state.createStoreSuccess = true;
      state.createStoreError = '';
      state.store = action.payload;
    },
    [createStore.rejected]: (state, action) => {
      state.createStoreLoader = false;
      state.createStoreSuccess = false;
      state.createStoreError = '';
      state.store = {};
    },
    [deleteStores.pending]: (state) => {
      state.deleteStoreError = '';
      state.deleteStoreLoader = true;
      state.deleteStoresuccess = false;
    },
    [deleteStores.fulfilled]: (state, action) => {
      state.deleteStoreError = '';
      state.deleteStoreLoader = false;
      state.deleteStoresuccess = true;
      state.deletedStores = action?.payload?.result || [...state.deletedStores];

      if (Array.isArray(state.deletedStores) && state.deletedStores.length > 0) {
        const deletedStoreIds = state.deletedStores.map((store) => store._id);
        state.stores = state.stores.filter((store) => !deletedStoreIds.includes(store._id));
      }
    },
    [deleteStores.rejected]: (state, action) => {
      state.deleteStoreError = action.error.message || 'Failed to delete Stores.';
      state.deleteStoreLoader = false;
      state.deleteStoresuccess = false;
    },

    [getDeletedStore.pending]: (state) => {
      state.getDeletedStoreLoader = true;
      state.getDeletedStoreSuccess = false;
      state.getDeletedStoreError = '';
    },
    [getDeletedStore.fulfilled]: (state, action) => {
      state.getDeletedStoreLoader = false;
      state.getDeletedStoreSuccess = true;
      state.getDeletedStoreError = '';
      state.stores = action?.payload?.storeList;
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [getDeletedStore.rejected]: (state) => {
      state.getDeletedStoreLoader = false;
      state.getDeletedStoreSuccess = false;
      state.getDeletedStoreError = '';
    },
    [restoreStores.pending]: (state) => {
      state.restoreStoreLoader = true;
      state.restoreStoresuccess = false;
      state.restoreStoreError = '';
    },
    [restoreStores.fulfilled]: (state, action) => {
      state.restoreStoreLoader = false;
      state.restoreStoreSuccess = true;
      state.Stores = action?.payload?.StoreList;
      state.restoreStoreError = '';
    },
    [restoreStores.rejected]: (state, action) => {
      state.restoreStoreError = action?.payload?.message;
      state.restoreStoreLoader = false;
      state.restoreStoreSuccess = false;
    },
    [storeCommissionList.pending]: (state) => {
      state.storeCommissionLoader = true;
      state.storeCommissionSuccess = false;
      state.storeCommissionError = '';
    },
    [storeCommissionList.fulfilled]: (state, action) => {
      state.storeCommissionLoader = false;
      state.storeCommissionSuccess = true;
      state.storeCommisions = action?.payload?.storeList;
state.totalCommissions = action?.payload?.totalCommission;

      state.storeCommissionError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.pages = action?.payload?.pages;
      state.order = action?.payload?.order;
    },
    [storeCommissionList.rejected]: (state, action) => {
      state.storeCommissionError = action.payload?.message;
      state.storeCommissionLoader = false;
      state.storeCommissionSuccess = false;
    },
    [getStoreCommission.pending]: (state) => {
      state.getStoreCommissionLoader = true;
      state.getStoreCommissionSuccess = false;
      state.getStoreCommissionError = '';
      state.pendingCommisiion = 0;
    },
    [getStoreCommission.fulfilled]: (state, action) => {
      state.getStoreCommissionLoader = false;
      state.getStoreCommissionSuccess = true;
      state.dateList = action?.payload?.dateList;
      state.getStoreCommissionError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pendingCommisiion = action?.payload?.totalAmount;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [getStoreCommission.rejected]: (state, action) => {
      state.getStoreCommissionError = action.payload?.message;
      state.getStoreCommissionLoader = false;
      state.getStoreCommissionSuccess = false;
    },
    [getStorePayments.pending]: (state) => {
      state.getStorePaymentsLoader = true;
      state.getStorePaymentsSuccess = false;
      state.getStorePaymentsError = '';
    },
    [getStorePayments.fulfilled]: (state, action) => {
   
      state.getStorePaymentsLoader = false;
      state.getStorePaymentsSuccess = true;
      state.payments = action?.payload.paymentList;
      state.getStorePaymentsError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.order = action?.payload?.order;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },

    [getStorePayments.rejected]: (state, action) => {
      state.getStorePaymentsError = action.payload?.message;
      state.getStorePaymentsLoader = false;
      state.getStorePaymentsSuccess = false;
    },
    [getStoreNames.pending]: (state) => {
      state.stores = [];
      state.getStoreNamesLoader = true;
      state.getStoreNamesSuccess = false;
      state.getStoreNamesError = '';
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.order = 'asc';
    },
    [getStoreNames.fulfilled]: (state, action) => {
      
      state.stores = action?.payload?.storeList;
      state.getStoreNamesLoader = false;
      state.getStoreNamesSuccess = true;
      state.getStoreNamesError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [getStoreNames.rejected]: (state, action) => {
      state.stores = [];
      state.getStoreNamesLoader = false;
      state.getStoreNamesSuccess = false;
      state.getStoreNamesError = action.payload?.message || 'Failed to get agent names';
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
    },
    [postStorePayments.pending]: (state) => {
      state.postStorePaymentsLoader = true;
      state.postStorePaymentsSuccess = false;
      state.postStorePaymentsError = '';
    },
  
  },
});

export const { resetEditStore } = storeSlice.actions;

export default storeSlice.reducer;
