import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Container,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputLabel,
  Stack,
  TablePagination,
  Alert,
  Snackbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';

import AvatarUploader from '../components/AvatarUploader';
import AppWidgetSummary from '../sections/@dashboard/app/AppWidgetSummary';
import Scrollbar from '../components/scrollbar';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { editAgent, getAgent, getAgentCommission } from '../features/agentSlice';
import { UserListHead } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'createdAt', label: 'Date', align: 'center' },
  { id: 'totalCommission', label: 'Total Commission', align: 'center' },

  { id: 'commissionPending', label: 'Commission Pending', align: 'center' },
  { id: 'remarks', label: 'Remarks', align: 'center' },
];

const useStyles = makeStyles({
  unhighlightedTextField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important', // Add !important
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important', // Add !important
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important', // Add !important
    },
    '&:hover': {
      cursor: 'not-allowed', // Change the cursor on hover
    },
    '&:before': {
      display: 'none', // Hide the arrow icon
    },
    '&:after': {
      display: 'none', // Hide the arrow icon
    },
  },
});

function AgentProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState({
    fromDate: '',
    toDate: '',
    date: '',
  });
  const [formData, setFormData] = useState({
    profilePic: '',
  });
  const [imageSrc, setImageSrc] = useState('');

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');
  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  useEffect(() => {
    dispatch(getAgent({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getAgentCommission({ id, params: searchParams }));
  }, [dispatch, id, searchParams]);

  const {
    agent,
    getAgentLoader,
    dateList,
    documentCount,
    limit,
    page,
    getAgentCommissionLoader,
    getAgentCommissionError,
    paymentAmount,
    totalCommission,
    totalPending,
  } = useSelector((state) => state.agent);

  // const handleOpenDialog = () => {
  //   dispatch(resetAmount())
  //   setPaymentData({
  //   fromDate: '',
  //   toDate: '',
  //   date: '',})
  //   setOpenDialog(true);
  // };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPaymentRecord = {
      amount: paymentAmount,
      date: paymentData.date,
      invoiceFrom: paymentData.fromDate,
      invoiceTo: paymentData.toDate,
      agent: id,
    };
  };

  const handleSubmitProfile = () => {
    const changedFields = {};
    Object.keys(formData).forEach((field) => {
      if (!(field === 'profilePic' && typeof formData[field] === 'string')) {
        if (
          formData[field] !== '' &&
          formData[field] !== null &&
          formData[field] !== undefined &&
          agent?.agent[field] !== formData[field]
        ) {
          changedFields[field] = formData[field];
        }
      }
    });

    console.log(formData);
    dispatch(editAgent({ id, obj: formData }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification('Agent Edited successfully', 'success');
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Edition', 'error');
      });
  };

  const handleAvatarFileChange = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePic: file,
    }));
    console.log(formData);

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
    });

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Only submit the form when the profilePic in formData changes
    if (formData.profilePic !== '') {
      handleSubmitProfile();
    }
  }, [formData.profilePic]);

  const handleChangePage = (e, newPage) => {
    searchParams.set('page', newPage + 1);
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (e) => {
    searchParams.delete('page');
    searchParams.set('limit', e.target.value);
    setSearchParams(searchParams);
  };

  const handleReset = () => {
    setSearchParams('');
  };
  return (
    <>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="Agent Profile" />
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <Snackbar
            open={notificationOpen}
            autoHideDuration={6000}
            onClose={() => setNotificationOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert variant="filled" onClose={() => setNotificationOpen(false)} severity={notificationSeverity}>
              {notificationMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
      <form>
        <Grid container spacing={3} px={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom textAlign={'center'}>
                  Profile Picture
                </Typography>
                <Box display="flex" justifyContent="center" marginBottom="16px" className="avatar-container">
                  <AvatarUploader
                    profilePic={agent?.agent?.profilePic?.url || imageSrc}
                    isEdit
                    onFileChange={handleAvatarFileChange}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              {getAgentLoader ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} height="400px">
                  <CircularProgress />
                  Loading...
                </Box>
              ) : (
                <CardContent>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                    }}
                  >
                    <TextField
                      label="Full Name"
                      name="name"
                      value={agent?.agent?.name || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { borderColor: 'transparent' }, // Remove the border
                      }}
                      className={classes.unhighlightedTextField}
                    />
                    <TextField
                      label="Email ID"
                      name="email"
                      value={agent?.agent?.email || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                    }}
                  >
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={agent?.agent?.phoneNumber || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                    <TextField
                      label="Gender"
                      name="gender"
                      value={agent?.agent?.gender || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                    }}
                  >
                    <TextField
                      label="IFSC Code"
                      name="ifscCode"
                      value={agent?.agent?.ifscCode || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                    <TextField
                      label="Bank Name"
                      name="bankName"
                      value={agent?.agent?.bankName || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                    }}
                  >
                    <TextField
                      label="Branch Name"
                      name="branchName"
                      value={agent?.agent?.branchName || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />

                    <TextField
                      label="PAN Number"
                      name="pan"
                      value={agent?.agent?.pan || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                    }}
                  >
                    <TextField
                      label="Account Number"
                      name="accNo"
                      value={agent?.agent?.accNo || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                    <TextField
                      label="CAT"
                      name="cat"
                      value={agent?.agent?.cat || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                      marginTop: '0',
                    }}
                  >
                    <TextField
                      label="Aadhar Number"
                      name="aadhar"
                      value={agent?.agent?.aadhar || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />

                    <TextField
                      label="Date Of Birth"
                      name="dob"
                      value={new Date(agent?.agent?.dob).toLocaleDateString('en-GB')}
                      style={{ width: '45%' }}
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>

                  <br />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                      cursor: 'default',
                      marginTop: '0',
                    }}
                  >
                    <TextField
                      label="Address"
                      name="address"
                      value={agent?.agent?.address || 'N/A'}
                      style={{ width: '45%' }}
                      variant="outlined"
                      multiline
                      rows={4}
                      InputProps={{ readOnly: true }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
      </form>
      <br />
      <Container maxWidth="xl">
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Commission" total={+totalCommission?.toFixed(2) || 0} color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pending Commission" total={+totalPending?.toFixed(2) || 0} color="error" />
          </Grid>
        </Grid>
      </Container>
      <br />
      <Container>
        <Card>
          <Stack alignItems={'end'} m={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={'end'} width={'100%'}>
              <Box width={'100%'}>
                <InputLabel htmlFor="fromDate">From</InputLabel>
                <TextField
                  fullWidth
                  name="fromDate"
                  type="date"
                  value={searchParams.get('startDate') || ''}
                  onChange={(event) => {
                    searchParams.set('startDate', event.target.value);
                    setSearchParams(searchParams);
                  }}
                />
              </Box>
              <Box width={'100%'}>
                <InputLabel htmlFor="fromDate">To</InputLabel>
                <TextField
                  fullWidth
                  name="fromDate"
                  type="date"
                  value={searchParams.get('endDate') || ''}
                  onChange={(event) => {
                    searchParams.set('endDate', event.target.value);
                    setSearchParams(searchParams);
                  }}
                />
              </Box>
            </Stack>
            <Stack justifyContent="center" display={'flex'} alignItems={'center'} mt={3} width={'100%'}>
              <Button onClick={handleReset} variant="outlined" sx={{ width: '100%', maxWidth: '10rem' }}>
                Reset
              </Button>
            </Stack>
          </Stack>

          <br />
          <TableContainer component={Paper}>
            <Scrollbar>
              <Table>
                <UserListHead
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set('asc', (agent.order === 'asc' && 'false') || (agent.order === 'desc' && 'true'));
                    setSearchParams(searchParams);
                  }}
                  order={agent.order}
                  sortType={agent.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={agent.stores?.length}
                />
                <TableBody style={{ backgroundColor: 'white' }}>
                  {getAgentCommissionLoader ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        Loading...
                      </td>
                    </tr>
                  ) : getAgentCommissionError ? (
                    <>
                      <Alert severity="error">{getAgentCommissionError}</Alert>
                    </>
                  ) : (
                    dateList?.map((agentData, index) => {
                      const { _id, commissions, storePending, pendingCommission } = agentData;
                      const serialNumber = index + 1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} style={{ margincenter: '10px' }}>
                          <TableCell align="center">{serialNumber}</TableCell>
                          <TableCell align="center">{new Date(_id).toLocaleDateString('en-GB')}</TableCell>
                          <TableCell align="center">{commissions.toFixed(2)}</TableCell>

                          <TableCell align="center">{pendingCommission.toFixed(2)}</TableCell>
                          <TableCell align="center">{pendingCommission === 0 ? 'Paid' : 'Not Paid'}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
            component="div"
            count={documentCount || 0}
            rowsPerPage={limit || 10}
            page={(page || 1) - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ pb: 0 }}>Enter Payment Details</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography pb={2}>
              Amount : {paymentAmount || (paymentAmount === 0 ? 0 : ' Please select from and to dates')}
            </Typography>
            <TextField
              label="Payment Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={paymentData.date}
              onChange={(e) => {
                setPaymentData({ ...paymentData, date: e.target.value });
              }}
              variant="outlined"
              margin="dense"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default AgentProfile;
