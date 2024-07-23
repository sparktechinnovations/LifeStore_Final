
import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  products: [],
  product: {},
  deletedProducts: [],
  productListLoader: false,
  createProductLoader: false,
  getProductLoader: false,
  productListError: '',
  createProductError: '',
  getProductError: '',
  createProductSuccess: false,
  getProductSuccess: false,
  pages: 1,
  page: 1,
  documentCount: 0,
  limit: 10,
  order: 'asc',
  editProductLoader: false,
  editProductSuccess: false,
  editProductError: '',
  deleteProductsLoader: false,
  deleteProductsuccess: false,
  deleteProductsError: '',
  getDeletedProductsLoader: false,
  getDeletedProductsSuccess: false,
  getDeletedProductsError: '',
  restoreProductLoader: false,
  restoreProductSuccess: false,
  restoreProductError: '',
};

export const productList = createAsyncThunk(
  'product/list',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/product?${params}`, {
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

export const createProduct = createAsyncThunk(
  'product/create',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/product',
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

export const getProduct = createAsyncThunk(
  'product/get',
  async ({ id }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/product/${id}`, {
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

export const editProduct = createAsyncThunk(
  'product/edit',
  async ({ id, obj }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
     

      const response = await axios.put(
        `/api/product/${id}`,
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
export const deleteProducts = createAsyncThunk(
  'product/delete',
  async ({ idArray: selectedProductIds,params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/product/delete-many',
        { idArray: selectedProductIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(productList({params}))
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

export const getDeletedProducts = createAsyncThunk(
  'product/deleteList',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/product?deleteStatus=${true}&${params}`, {
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

export const restoreProducts = createAsyncThunk(
  'product/restore',
  async ({ idArray: selectedProductIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/product/restore-many`,
        { idArray: selectedProductIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(getDeletedProducts({ params }));
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

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetEditProduct: (state) => {
      state.editProductSuccess = false;
      state.editProductError = '';
    },
    resetDeleteProducts: (state) => {
      state.deleteProductsuccess = false;
      state.deleteProductsError = '';
    },
  },
  extraReducers: {
    [productList.pending]: (state) => {
      state.products = [];
      state.productListLoader = true;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.productListError = '';
    },
    [productList.fulfilled]: (state, action) => {
      state.products = action.payload?.productList;
      state.productListLoader = false;
      state.documentCount = action.payload?.documentCount;
      state.page = action.payload?.page;
      state.limit = action.payload?.limit;
      state.order = action.payload?.order;
      state.sortType = action.payload?.sortType;
      state.pages = Math.ceil(action.payload?.documentCount / action.payload?.limit);
      state.productListError = '';
    },
    [productList.rejected]: (state, action) => {
      state.products = [];
      state.productListLoader = false;
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.productListError = action.payload?.message;
    },
    [createProduct.pending]: (state) => {
      state.createProductLoader = true;
      state.createProductSuccess = false;
      state.createProductError = '';
    },
    [createProduct.fulfilled]: (state, action) => {
      state.createProductLoader = false;
      state.createProductSuccess = true;
      state.createProductError = '';
    },
    [createProduct.rejected]: (state, action) => {
      state.createProductLoader = false;
      state.createProductSuccess = false;
      state.createProductError = action.payload?.message;
    },
    [getProduct.pending]: (state) => {
      state.product = {};
      state.getProductLoader = true;
      state.getProductSuccess = false;
      state.getProductError = '';
    },
    [getProduct.fulfilled]: (state, action) => {
      state.getProductLoader = false;
      state.getProductSuccess = true;
      state.getProductError = '';
      state.product = action.payload
    },
    [getProduct.rejected]: (state, action) => {
      state.getProductLoader = false;
      state.getProductSuccess = false;
      state.getProductError = action.payload?.message;
      state.product = {};
    },
    [editProduct.pending]: (state) => {
      state.product = {};
      state.editProductLoader = true;
      state.editProductSuccess = false;
      state.editProductError = '';
    },
    [editProduct.fulfilled]: (state, action) => {
      state.editProductLoader = false;
      state.editProductSuccess = true;
      state.editProductError = '';
      state.product = action.payload
    },
    [editProduct.rejected]: (state, action) => {
      state.editProductLoader = false;
      state.editProductSuccess = false;
      state.editProductError = action.payload?.message;
      state.product = {};
    },
    [deleteProducts.pending]: (state) => {
      state.deleteProductsError = '';
      state.deleteProductsLoader = true;
      state.deleteProductsuccess = false;
    },
    [deleteProducts.fulfilled]: (state, action) => {
      state.deleteProductsError = '';
      state.deleteProductsLoader = false;
      state.deleteProductsuccess = true;
      state.deletedProducts = action.payload?.result || [...state.deletedProducts];

      if (Array.isArray(state.deletedProducts) && state.deletedProducts.length > 0) {
        const deletedProductIds = state.deletedProducts.map((product) => product._id);
        state.products = state.products.filter((product) => !deletedProductIds.includes(product._id));
      }
    },
    [deleteProducts.rejected]: (state, action) => {
      state.deleteProductsError = action.error.message || 'Failed to delete Products.';
      state.deleteProductsLoader = false;
      state.deleteProductsuccess = false;
    },

    [getDeletedProducts.pending]: (state) => {
      state.getDeletedProductsLoader = true;
      state.getDeletedProductsSuccess = false;
      state.getDeletedProductsError = '';
    },
    [getDeletedProducts.fulfilled]: (state, action) => {
      state.getDeletedProductsLoader = false;
      state.getDeletedProductsSuccess = true;
      state.getDeletedProductsError = '';
      state.products = action.payload?.productList;
      state.documentCount = action.payload?.documentCount;
      state.page = action.payload?.page;
      state.limit = action.payload?.limit;
      state.order = action.payload?.order;
      state.sortType = action.payload?.sortType;
      state.pages = Math.ceil(action.payload?.documentCount / action.payload?.limit);
    },
    [getDeletedProducts.rejected]: (state) => {
      state.getDeletedProductsLoader = false;
      state.getDeletedProductsSuccess = false;
      state.getDeletedProductsError = '';
    },
    [restoreProducts.pending]: (state) => {
      state.restoreProductLoader = true;
      state.restoreProductSuccess = false;
      state.restoreProductError = '';
    },
    [restoreProducts.fulfilled]: (state, action) => {
      state.restoreProductLoader = false;
      state.restoreProductSuccess = true;
      state.products = action.payload?.productList;
      state.restoreProductError = '';
    },
    [restoreProducts.rejected]: (state, action) => {
      state.restoreProductError = action.payload?.message;
      state.restoreProductLoader = false;
      state.restoreProductSuccess = false;
    },
  },
});

export const { resetEditProduct, resetDeleteProducts } = productSlice.actions;

export default productSlice.reducer;
