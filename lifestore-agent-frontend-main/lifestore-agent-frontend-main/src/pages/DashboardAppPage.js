import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { Grid, Container, Typography, CircularProgress, Stack, Alert, styled, Box } from '@mui/material';
import { DatePicker } from 'antd';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';

import { getHomeData } from '../features/homeSlice';
import AppWidgetSummary from '../sections/@dashboard/app/AppWidgetSummary';

import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
// import SecondTable from './SecondTable';
const StyledRangePickerContainer = styled(Box)(({ theme }) => ({
  '@media (max-width: 576px)' :{
    '.ant-picker-panels' :{
      flexDirection:'column'
    }
  }
}));



export default function DashboardAppPage() {

  const { getHomeDataLoader,
  getHomeDataError,
  customerNumber,
  pendingAgentCommission,
  pendingStoreCommission,
  lifestoreIncome,} = useSelector(state=>state.home)
  const [searchParams,setSearchParams] = useSearchParams();


 
const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getHomeData({ params: searchParams }))
  },[dispatch, searchParams])
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <BreadcrumbsComponent />
        </div>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'end' }}>
            <DatePicker.RangePicker
              
              format={'DD-MM-YYYY'}
              panelRender={(panelNode) => <StyledRangePickerContainer>{panelNode}</StyledRangePickerContainer>}
              onChange={(value) => {
                searchParams.set('startDate', moment(value[0].$d).format('YYYY-MM-DD'));
                searchParams.set('endDate', moment(value[1].$d).format('YYYY-MM-DD'));

                setSearchParams(searchParams);
              }}
            />
          </div>

        <Grid container spacing={3}>
          {getHomeDataLoader ? (
            <>
              <Grid item xs={12}>
                <Stack alignItems={'center'} justifyContent={'center'} direction={'row'} gap={2}>
                  <CircularProgress />
                  <p>Loading..</p>
                </Stack>
              </Grid>
            </>
          ) : getHomeDataError ? (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography m={0} p={0}>
                  {getHomeDataError} jglfjgklj
                </Typography>
              </Alert>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <AppWidgetSummary title="Total Customers" total={+customerNumber?.toFixed(2) || 0} color="info" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <AppWidgetSummary title="Agent Income" total={+lifestoreIncome?.toFixed(2) || 0} color="success" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <AppWidgetSummary
                  title="Amount pending to Agents"
                  total={+pendingAgentCommission?.toFixed(2) || 0}
                  color="error"
                />
              </Grid>
            </>
          )}
               {/* <Grid item xs={12} md={12}>
              <SecondTable />
            </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
