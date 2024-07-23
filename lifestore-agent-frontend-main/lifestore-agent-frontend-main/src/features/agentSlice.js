import { Alert } from '@mui/material';
import axios from './axios/axios';
import { logout } from './authSlice';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  agents: [],
  agent: {},
  getAgentError: '',
  getAgentLoader: false,
  getAgentSuccess: false,
  editAgentError: '',
  editAgentLoader: false,
  editAgentSuccess: false,
  createAgentError: '',
  createAgentLoader: false,
  createAgentSuccess: false,
  agentListLoader: false,
  agentListSuccess: false,
  agentListError: '',
  pages: 1,
  page: 1,
  documentCount: 0,
  limit: 10,
  order: 'asc',
  deleteAgentLoader: false,
  deleteAgentSuccess: false,
  deleteAgentError: '',
  getDeletedAgentsLoader: false,
  getDeletedAgentsSuccess: false,
  getDeletedAgentsError: '',
  restoreAgentLoader: false,
  restoreAgentSuccess: false,
  restoreAgentError: '',
  agentCommissionError: '',
  agentCommissionLoader: false,
  agentCommissionSuccess: false,
  getAdmissionCommissionLoader: false,
  getAdmissionCommissionSuccess: false,
  getAdmissionCommissionError: false,
  dateList: [],
  agentCommissions: [],
  payments: [],
  getAgentPaymentsSuccess: false,
  getAgentPaymentsError: '',
  getAgentPaymentsLoader: false,
  getAgentNamesError: '',
  getAgentNamesLoader: false,
  getAgentNamesSuccess: false,
  postAgentPaymentsSuccess: false,
  postAgentPaymentsError: '',
  postAgentPaymentsLoader: false,
};

export const agentList = createAsyncThunk(
  'agent/list',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/agent?${params}`, {
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
        dispatch(logout());
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAgentNames = createAsyncThunk(
  'agent/names',
  async ({ search }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/agent?search=${search}`, {
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
        dispatch(logout());
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAgent = createAsyncThunk(
  'agent/get',
  async ({ id }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/agent/${id}`, {
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
        dispatch(logout());
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAgent = createAsyncThunk(
  'agent/create',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/agent',
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
        <Alert severity='error'>Network Error! Try Refreshing page! If problem persists, please Contact Support!</Alert>

        return rejectWithValue({ message: 'Network Error' });
      }
      if (error.response.status === 401 || error.response.status === 403) {
        dispatch(logout());
      }
      
      return rejectWithValue(error.response.data);
    }
  }
);

export const editAgent = createAsyncThunk(
  'agent/edit',
  async ({ id, obj }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.put(
        `/api/agent/${id}`,
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

export const deleteAgents = createAsyncThunk(
  'agent/delete',
  async ({ idArray: selectedAgentIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        '/api/agent/delete-many',
        { idArray: selectedAgentIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(agentList({ params }));
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

export const getDeletedAgents = createAsyncThunk(
  'agent/deleteList',
  async ({ obj, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(`/api/agent?deleteStatus=${true}&${params}`, {
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

export const restoreAgents = createAsyncThunk(
  'agent/restore',
  async ({ idArray: selectedAgentIds, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/agent/restore-many`,
        { idArray: selectedAgentIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      dispatch(getDeletedAgents({ params }));
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

export const agentCommissionList = createAsyncThunk(
  'agent/commissions',
  async ({ params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/api/commission/agent-commissions?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log();
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

export const getAgentCommission = createAsyncThunk(
  'agent/commission-amount',
  async ({ id, params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    console.log(id, params);
    try {
      const { auth } = getState();
      const queryParams = params ? `?${params}` : '';
      const response = await axios.get(`/api/commission/agent-commissions/${id}${queryParams}`, {
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

export const getAgentCommissionAmount = createAsyncThunk(
  'agent/commission',
  async ({ id, startDate, endDate }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    console.log(id, startDate, endDate);
    try {
      const { auth } = getState();
      const response = await axios.get(
        `/api/commission/agent-commissions/${id}/amount?endDate=${endDate}&&startDate=${startDate}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log(response.data);
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

export const getAgentPayments = createAsyncThunk(
  'agent/payments',
  async ({ params }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`api/commission/payment/agent?${params}`, {
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

export const postAgentPayments = createAsyncThunk(
  'agent/payments-post',
  async ({ id, newPaymentRecord }, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        `/api/commission/agent-commissions/${id}`,
        { ...newPaymentRecord },
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

export const forgotPassword = createAsyncThunk(
  'agent/forgot',
  async (obj, { rejectWithValue, dispatch, getState, fulfillWithValue }) => {
    console.log(obj);
    try {

      const response = await axios.put(
        '/api/agent/forgotPassword',
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


export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    resetEditAgent: (state) => {
      state.editAgentSuccess = false;
      state.editAgentError = '';
    },
  },
  extraReducers: {
    [agentList.pending]: (state) => {
      state.agents = [];
      state.agentListLoader = true;
      state.agentListSuccess = false;
      state.agentListError = '';
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.order = 'asc';
    },
    [agentList.fulfilled]: (state, action) => {
      state.agents = action?.payload?.agentList;
      
      state.agentListLoader = false;
      state.agentListSuccess = true;
      state.agentListError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [agentList.rejected]: (state, action) => {
      state.agents = [];
      state.agentListLoader = false;
      state.agentListSuccess = false;
      state.agentListError = '';
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
    },
    [getAgentNames.pending]: (state) => {
      state.agents = [];
      state.getAgentNamesLoader = true;
      state.getAgentNamesSuccess = false;
      state.getAgentNamesError = '';
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
      state.order = 'asc';
    },
    [getAgentNames.fulfilled]: (state, action) => {
      
      state.agents = action?.payload?.agentList;
      state.getAgentNamesLoader = false;
      state.getAgentNamesSuccess = true;
      state.getAgentNamesError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [getAgentNames.rejected]: (state, action) => {
      state.agents = [];
      state.getAgentNamesLoader = false;
      state.getAgentNamesSuccess = false;
      state.getAgentNamesError = action.payload?.message || 'Failed to get agent names';
      state.pages = 1;
      state.page = 1;
      state.documentCount = 0;
      state.limit = 10;
    },
    [getAgent.pending]: (state) => {
      state.agent = {};
      state.getAgentLoader = true;
      state.getAgentSuccess = false;
      state.getAgentError = '';
    },
    [getAgent.fulfilled]: (state, action) => {
      state.getAgentLoader = false;
      state.getAgentSuccess = true;
      state.getAgentError = '';
      state.agent = action.payload;
    },
    [getAgent.rejectWithValue]: (state, action) => {
      state.getAgentLoader = false;
      state.getAgentSuccess = false;
      state.getAgentError = action?.payload?.message;
      state.agent = {};
    },
    [createAgent.pending]: (state) => {
      state.createAgentLoader = true;
      state.createAgentSuccess = false;
      state.createAgentError = '';
    },
    [createAgent.fulfilled]: (state, action) => {
      state.createAgentLoader = false;
      state.createAgentSuccess = true;
      state.createAgentError = '';
    },
    [createAgent.rejected]: (state, action) => {
      
      state.createAgentLoader = false;
      state.createAgentSuccess = false;
      state.createAgentError = action?.payload?.message;
    },
    [editAgent.pending]: (state) => {
      state.agent = {};
      state.editAgentLoader = true;
      state.editAgentSuccess = false;
      state.editAgentError = '';
    },
    [editAgent.fulfilled]: (state, action) => {
      state.editAgentLoader = false;
      state.editAgentSuccess = true;
      state.editAgentError = '';
      state.agent = action.payload;
    },
    [editAgent.rejected]: (state, action) => {
      state.editAgentLoader = false;
      state.editAgentSuccess = false;
      state.editAgentError = action?.payload?.message;
      state.agent = {};
    },
    [deleteAgents.pending]: (state) => {
      state.deleteAgentError = '';
      state.deleteAgentLoader = true;
      state.deleteAgentsuccess = false;
    },
    [deleteAgents.fulfilled]: (state, action) => {
      state.deleteAgentError = '';
      state.deleteAgentLoader = false;
      state.deleteAgentsuccess = true;
      state.deletedAgents = action?.payload?.result || [...state.deletedAgents];

      if (Array.isArray(state.deletedAgents) && state.deletedAgents.length > 0) {
        const deletedAgentIds = state.deletedAgents.map((Agent) => Agent._id);
        state.agents = state.agents.filter((Agent) => !deletedAgentIds.includes(Agent._id));
      }
    },
    [deleteAgents.rejected]: (state, action) => {
      state.deleteAgentError = action.error.message || 'Failed to delete Agents.';
      state.deleteAgentLoader = false;
      state.deleteAgentsuccess = false;
    },

    [getDeletedAgents.pending]: (state) => {
      state.getDeletedAgentsLoader = true;
      state.getDeletedAgentsSuccess = false;
      state.getDeletedAgentsError = '';
    },
    [getDeletedAgents.fulfilled]: (state, action) => {
      state.getDeletedAgentsLoader = false;
      state.getDeletedAgentsSuccess = true;
      state.getDeletedAgentsError = '';
      state.agents = action?.payload?.agentList;
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [getDeletedAgents.rejected]: (state) => {
      state.getDeletedAgentsLoader = false;
      state.getDeletedAgentsSuccess = false;
      state.getDeletedAgentsError = '';
    },
    [restoreAgents.pending]: (state) => {
      state.restoreAgentLoader = true;
      state.restoreAgentsuccess = false;
      state.restoreAgentError = '';
    },
    [restoreAgents.fulfilled]: (state, action) => {
      state.restoreAgentLoader = false;
      state.restoreAgentsuccess = true;
      state.agents = action?.payload?.agentList;
      state.restoreAgentError = '';
    },
    [restoreAgents.rejected]: (state, action) => {
      state.restoreAgentError = action?.payload?.message;
      state.restoreAgentLoader = false;
      state.restoreAgentsuccess = false;
    },
    [agentCommissionList.pending]: (state) => {
      state.agentCommissionLoader = true;
      state.agentCommissionSuccess = false;
      state.agentCommissionError = '';
    },
    [agentCommissionList.fulfilled]: (state, action) => {
      state.agentCommissionLoader = false;
      state.agentCommissionSuccess = true;
      state.agentCommissions = action?.payload?.storeList;

      state.agentCommissionError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },
    [agentCommissionList.rejected]: (state, action) => {
      state.agentCommissionError = action.payload?.message;
      state.agentCommissionLoader = false;
      state.agentCommissionSuccess = false;
    },
    [getAgentCommission.pending]: (state) => {
      state.getAgentCommissionLoader = true;
      state.getAgentCommissionSuccess = false;
      state.getAgentCommissionError = '';
    },
    [getAgentCommission.fulfilled]: (state, action) => {
      
      state.getAgentCommissionLoader = false;
      state.getAgentCommissionSuccess = true;
      state.dateList = action?.payload?.dateList;
      state.getAgentCommissionError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.limit = action?.payload?.limit;
      state.order = action?.payload?.order;
      state.sortType = action?.payload?.sortType;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
      state.totalCommission = action?.payload?.totalCommission; 
      state.totalPending = action?.payload?.totalPending;
    },
    [getAgentCommission.rejected]: (state, action) => {
      state.getAgentCommissionError = action.payload?.message;
      state.getAgentCommissionLoader = false;
      state.getAgentCommissionSuccess = false;
    },
    [getAgentPayments.pending]: (state) => {
      state.getAgentPaymentsLoader = true;
      state.getAgentPaymentsSuccess = false;
      state.getAgentPaymentsError = '';
    },
    [getAgentPayments.fulfilled]: (state, action) => {
      state.getAgentPaymentsLoader = false;
      state.getAgentPaymentsSuccess = true;
      state.payments = action?.payload.paymentList;
      state.getAgentPaymentsError = '';
      state.documentCount = action?.payload?.documentCount;
     state.page = action?.payload?.page;
     state.limit = action?.payload?.limit;
     state.order = action?.payload?.order;
     state.sortType = action?.payload?.sortType;
     state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },

    [getAgentPayments.rejected]: (state, action) => {
      state.getAgentPaymentsError = action.payload?.message;
      state.getAgentPaymentsLoader = false;
      state.getAgentPaymentsSuccess = false;
    },
    [postAgentPayments.pending]: (state) => {
      state.postAgentPaymentsLoader = true;
      state.postAgentPaymentsSuccess = false;
      state.postAgentPaymentsError = '';
    },
    [postAgentPayments.fulfilled]: (state, action) => {
      state.postAgentPaymentsLoader = false;
      state.postAgentPaymentsSuccess = true;
      state.payments = action?.payload.paymentList;
      state.postAgentPaymentsError = '';
      state.documentCount = action?.payload?.documentCount;
      state.page = action?.payload?.page;
      state.order = action?.payload?.order;
      state.pages = Math.ceil(action?.payload?.documentCount / action?.payload?.limit);
    },

    [postAgentPayments.rejected]: (state, action) => {
      state.postAgentPaymentsError = action.payload?.message;
      state.postAgentPaymentsLoader = false;
      state.postAgentPaymentsSuccess = false;
    },
    [getAgentPayments.rejected]: (state, action) => {
      state.getAgentPaymentsError = action.payload?.message;
      state.getAgentPaymentsLoader = false;
      state.getAgentPaymentsSuccess = false;
    },
    [getAgentCommissionAmount.pending]: (state) => {
      state.getAgentCommissionAmountLoader = true;
      state.getAgentCommissionAmountSuccess = false;
      state.getAgentCommissionAmountError = '';
      state.paymentAmount = '';
    },
    [getAgentCommissionAmount.fulfilled]: (state, action) => {
      state.getAgentCommissionAmountLoader = false;
      state.getAgentCommissionAmountSuccess = true;
      state.paymentAmount = action.payload.amount;
    },

    [getAgentCommissionAmount.rejected]: (state, action) => {
      state.getAgentCommissionAmountError = action.payload?.message;
      state.getAgentCommissionAmountLoader = false;
      state.getAgentCommissionAmountSuccess = false;
      state.paymentAmount = '';
    },
  },
});

export const { resetEditAgent } = agentSlice.actions;

export default agentSlice.reducer;
