

import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  admins: [],
  admin: {},
  deletedAdmins: [],
  adminListLoader: false,
  createAdminLoader: false,
  getAdminLoader: false,
  adminListError: '',
  createAdminError: '',
  getAdminError: '',
  createAdminSuccess: false,
  getAdminSuccess: false,
  pages: 1,
  page: 1,
  documentCount: 0,
  limit: 10,
  order: 'asc',
  editAdminLoader: false,
  editAdminSuccess: false,
  editAdminError: '',
  deleteAdminLoader: false,
  deleteAdminSuccess: false,
  deleteAdminError: '',
  getDeletedAdminsLoader: false,
  getDeletedAdminsSuccess: false,
  getDeletedAdminsError: '',
  restoreAdminLoader: false,
  restoreAdminSuccess: false,
  restoreAdminError: '',
  forgotPasswordSuccess:false
};

export const adminList = createAsyncThunk(
  'admin/list',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/admin?${params}`, {
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

export const createAdmin = createAsyncThunk(
  'admin/create',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/admin',
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

export const getAdmin = createAsyncThunk(
  'admin/get',
  async ({ id }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/admin/${id}`, {
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

export const editAdmin = createAsyncThunk(
  'admin/edit',
  async ({ id, obj }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
     

      const response = await axios.put(
        `/api/admin/${id}`,
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
export const deleteAdmins = createAsyncThunk(
  'admin/delete',
  async ({ idArray: selectedAdminIds,params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/admin/delete-many',
        { idArray: selectedAdminIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(adminList({params}))
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

export const getDeletedAdmins = createAsyncThunk(
  'admin/deleteList',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/admin?deleteStatus=${true}&${params}`, {
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

export const restoreAdmins = createAsyncThunk(
  'admin/restore',
  async ({ idArray: selectedAdminIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/admin/restore-many`,
        { idArray: selectedAdminIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(getDeletedAdmins({ params }));
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

export const forgotPassword = createAsyncThunk(
  'admin/forgot',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {

      const response = await axios.put(
        '/api/admin/forgotPassword',
        { ...obj },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        

        return rejectWithValue({ message: 'Network Error! Try Refreshing page! If problem persists, please Contact Support!' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetEditAdmin: (state) => {
      state.editAdminSuccess = false;
      state.editAdminError = '';
    },
    resetDeleteAdmin: (state) => {
      state.deleteAdminSuccess = false;
      state.deleteAdminError = '';
    },
  },
  extraReducers: {
    [adminList.pending]: (state) => {
      state.admins = [];
      state.adminListLoader = true;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.adminListError = '';
    },
    [adminList.fulfilled]: (state, action) => {
      state.admins = action.payload?.adminList;
      state.adminListLoader = false;
      state.documentCount = action.payload?.documentCount;
      state.page = action.payload?.page;
      state.limit = action.payload?.limit;
      state.order = action.payload?.order;
      state.sortType = action.payload?.sortType;
      state.pages = Math.ceil(action.payload?.documentCount / action.payload?.limit);
      state.adminListError = '';
    },
    [adminList.rejected]: (state, action) => {
      state.admins = [];
      state.adminListLoader = false;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.adminListError = action.payload?.message;
    },
    [createAdmin.pending]: (state) => {
      state.createAdminLoader = true;
      state.createAdminSuccess = false;
      state.createAdminError = '';
    },
    [createAdmin.fulfilled]: (state, action) => {
      state.createAdminLoader = false;
      state.createAdminSuccess = true;
      state.createAdminError = '';
    },
    [createAdmin.rejected]: (state, action) => {
      state.createAdminLoader = false;
      state.createAdminSuccess = false;
      state.createAdminError = action.payload?.message;
    },
    [getAdmin.pending]: (state) => {
      state.admin = {};
      state.getAdminLoader = true;
      state.getAdminSuccess = false;
      state.getAdminError = '';
    },
    [getAdmin.fulfilled]: (state, action) => {
      state.getAdminLoader = false;
      state.getAdminSuccess = true;
      state.getAdminError = '';
      state.admin = action.payload
    },
    [getAdmin.rejected]: (state, action) => {
      state.getAdminLoader = false;
      state.getAdminSuccess = false;
      state.getAdminError = action.payload?.message;
      state.admin = {};
    },
    [editAdmin.pending]: (state) => {
      state.admin = {};
      state.editAdminLoader = true;
      state.editAdminSuccess = false;
      state.editAdminError = '';
    },
    [editAdmin.fulfilled]: (state, action) => {
      state.editAdminLoader = false;
      state.editAdminSuccess = true;
      state.editAdminError = '';
      state.admin = action.payload
    },
    [editAdmin.rejected]: (state, action) => {
      state.editAdminLoader = false;
      state.editAdminSuccess = false;
      state.editAdminError = action.payload?.message;
      state.admin = {};
    },
    [deleteAdmins.pending]: (state) => {
      state.deleteAdminError = '';
      state.deleteAdminLoader = true;
      state.deleteAdminSuccess = false;
    },
    [deleteAdmins.fulfilled]: (state, action) => {
      state.deleteAdminError = '';
      state.deleteAdminLoader = false;
      state.deleteAdminSuccess = true;
      state.deletedAdmins = action.payload?.result || [...state.deletedAdmins];

      if (Array.isArray(state.deletedAdmins) && state.deletedAdmins.length > 0) {
        const deletedAdminIds = state.deletedAdmins.map((admin) => admin._id);
        state.admins = state.admins.filter((admin) => !deletedAdminIds.includes(admin._id));
      }
    },
    [deleteAdmins.rejected]: (state, action) => {
      state.deleteAdminError = action.error.message || 'Failed to delete admins.';
      state.deleteAdminLoader = false;
      state.deleteAdminSuccess = false;
    },

    [getDeletedAdmins.pending]: (state) => {
      state.getDeletedAdminsLoader = true;
      state.getDeletedAdminsSuccess = false;
      state.getDeletedAdminsError = '';
    },
    [getDeletedAdmins.fulfilled]: (state, action) => {
      state.getDeletedAdminsLoader = false;
      state.getDeletedAdminsSuccess = true;
      state.getDeletedAdminsError = '';
      state.admins = action.payload?.adminList;
      state.documentCount = action.payload?.documentCount;
      state.page = action.payload?.page;
      state.limit = action.payload?.limit;
      state.order = action.payload?.order;
      state.sortType = action.payload?.sortType;
      state.pages = Math.ceil(action.payload?.documentCount / action.payload?.limit);
    },
    [getDeletedAdmins.rejected]: (state) => {
      state.getDeletedAdminsLoader = false;
      state.getDeletedAdminsSuccess = false;
      state.getDeletedAdminsError = '';
    },
    [restoreAdmins.pending]: (state) => {
      state.restoreAdminLoader = true;
      state.restoreAdminSuccess = false;
      state.restoreAdminError = '';
    },
    [restoreAdmins.fulfilled]: (state, action) => {
      state.restoreAdminLoader = false;
      state.restoreAdminSuccess = true;
      state.admins = action.payload?.adminList;
      state.restoreAdminError = '';
    },
    [restoreAdmins.rejected]: (state, action) => {
      state.restoreAdminError = action.payload?.message;
      state.restoreAdminLoader = false;
      state.restoreAdminSuccess = false;
    },
  
  },
});

export const { resetEditAdmin, resetDeleteAdmin } = adminSlice.actions;

export default adminSlice.reducer;
