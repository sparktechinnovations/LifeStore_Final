import React, { useState, useEffect } from 'react';
import {  useParams, useSearchParams } from 'react-router-dom';
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
  List,
  ListItem,
  CircularProgress,
  Stack,
  InputLabel,
  Alert,
  TablePagination,
  Snackbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import AvatarUploader from '../components/AvatarUploader';
import AppWidgetSummary from '../sections/@dashboard/app/AppWidgetSummary';

import Scrollbar from '../components/scrollbar';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { editStore, getStore, getStoreCommission, postStorePayments } from '../features/storeSlice';
import { UserListHead } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'siNo', label: 'SiNo', align: 'center' },
  { id: '_id', label: 'Date', align: 'center' },
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

function StoreProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [openDialog, setOpenDialog] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const [paymentData, setPaymentData] = useState({
    amount: '',
    date: '',
  });
  

  useEffect(() => {
    dispatch(getStore({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getStoreCommission({ id, params: searchParams }));
  }, [dispatch, id, searchParams]);

  const {
    store,
    getStoreLoader,
    getStoreSuccess,
    getStoreError,
    dateList,
    order,
    sortType,
    getStoreCommissionLoader,
    documentCount,
    limit,
    page,
    getStoreCommissionError,
    pendingCommisiion,
  } = useSelector((state) => state.store);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [formData,setFormData] = useState({
        profilePic: '',

    });
  const [imageSrc, setImageSrc] = useState('');

  
   useEffect(() => {
    // Only submit the form when the profilePic in formData changes
    if (formData.profilePic !== '') {
      handleSubmitStore();
    }
  }, [formData.profilePic]);


    const handleShowNotification = (message, severity) => {
      setNotificationMessage(message);
      setNotificationSeverity(severity);
      setNotificationOpen(true);
    };

  if (getStoreLoader) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
        <CircularProgress />
        {' Loading...'}
      </Box>
    );
  }

  if (!store.storName && !getStoreSuccess && getStoreError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
        <Alert severity="error">
          <Typography>{getStoreError}! Please Come Back After Some Time!</Typography>
        </Alert>
      </Box>
    );
  }

  const handleChangePage = (e, newPage) => {
    searchParams.set('page', newPage + 1);
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (e) => {
    searchParams.delete('page');
    searchParams.set('limit', e.target.value);
    setSearchParams(searchParams);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAmountChange = (event) => {
    setPaymentData({ ...paymentData, amount: event.target.value });
  };

  const handleDateChange = (event) => {
    setPaymentData({ ...paymentData, date: event.target.value });
  };

   const handleAvatarFileChange = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePic: file,
    }));

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
    });

    reader.readAsDataURL(file);
  
  };

 // eslint-disable-next-line react-hooks/rules-of-hooks


  
  const handleSubmit = (e) => {
    e.preventDefault();
 
    const newPaymentRecord = {
      amount: paymentData.amount,
      date: paymentData.date,
      store: id,
    };

    dispatch(postStorePayments(newPaymentRecord))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification(`Amount ${paymentData.amount} received seccussfully`, 'success');
       dispatch(getStore({ id }));
       dispatch(getStoreCommission({ id, params: searchParams }));
       handleCloseDialog();
       setPaymentData({ amount: '', date: '' });
      })
      .catch((error) => {
        handleShowNotification('Error recieving amount!', 'error');
       handleCloseDialog();
      });

  };

  const handleSubmitStore = () => {
 
    const changedFields = {};
    Object.keys(formData).forEach((field) => {
      if (
        !(field === 'profilePic' && typeof formData[field] === 'string')    
      ) {
        
        if ((formData[field] !== '' && formData[field] !== null && formData[field] !== undefined) && store?.store[field] !== formData[field]) {
          changedFields[field] = formData[field];
        }
      }
      
    });

    

    dispatch(editStore({ id, obj: changedFields }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        
        
        handleShowNotification(`Store updated successfully`, 'success');
      })
      .catch((error) => {
        handleShowNotification('Error occurred during update!', 'error');
      });
  };


  return (
    <>
      <div style={{ marginBottom: '20px', marginLeft: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="Store Profile" />
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
                  <AvatarUploader profilePic={store?.store?.profilePic?.url || imageSrc}  isEdit onFileChange={handleAvatarFileChange} />
                </Box>
                <Typography textAlign={'center'}>Store Uid : {store?.store?.storeUid}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Store Name"
                    name="storeName"
                    value={store?.store?.storeName}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                  <TextField
                    label="Email ID"
                    name="email"
                    value={store?.store?.email || 'N/A'}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                </div>
                <br />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={store?.store?.phoneNumber}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                  <TextField
                    label="Owner Name"
                    name="ownerName"
                    value={store?.store?.ownerName}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Address"
                    name="address"
                    value={store?.store?.address || 'N/A'}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={store?.store?.address?.length > 20 ? 4 : 1}
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                  <TextField
                    label="GST Number"
                    name="gstNumber"
                    value={store?.store?.gstNumber}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                </div>
                <br />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    fullWidth
                    label="Agent Percentage"
                    name="agentPercentage"
                    value={store?.store?.agentPercentage}
                    margin="normal"
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />

                  <TextField
                    fullWidth
                    label="LifeStore Percentage"
                    name="lifeStorePercentage"
                    value={store?.store?.lifeStorePercentage}
                    margin="normal"
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                </div>

                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Your Documents
                    </Typography>
                    <List>
                      {store?.store?.documents?.map((pdfFile, index) => (
                        <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
                          <a
                            href={pdfFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              textDecoration: 'none',
                              color: 'inherit',
                            }}
                          >
                            <PictureAsPdfIcon style={{ marginRight: '8px' }} />
                            <Typography variant="body2" gutterBottom style={{ flex: 1 }}>
                              {pdfFile.key.split('/').pop()}
                            </Typography>
                          </a>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </div>
               
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
      <br />
      <Container maxWidth="xl">
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pending Commission" total={+pendingCommisiion?.toFixed(2) || 0} color="error" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Credits"
              total={(store?.store?.credit && +store?.store?.credit.toFixed(2)) || 0}
              color="success"
            />
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
          </Stack>
          <br />
          <TableContainer component={Paper}>
            <Scrollbar>
              <Table>
                <UserListHead
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set('asc', (order === 'asc' && 'false') || (order === 'desc' && 'true'));
                    setSearchParams(searchParams);
                  }}
                  checkbox={false}
                  order={order}
                  sortType={sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={store.stores?.length}
                />

                <TableBody style={{ backgroundColor: 'white' }}>
                  {getStoreCommissionLoader ? (
                    <>
                      <TableRow>
                        <TableCell align="center" colSpan={4}>
                          <CircularProgress /> Loading...
                        </TableCell>
                      </TableRow>
                    </>
                  ) : getStoreCommissionError ? (
                    <>
                      <TableRow>
                        <TableCell align="center" colSpan={6}>
                          <Alert severity="error">{getStoreCommissionError}</Alert>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    dateList?.map((storeData, index) => {
                      const { _id, commissions, pendingCommission } = storeData;
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
        <DialogTitle>Enter Payment Details</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={paymentData.amount}
              onChange={handleAmountChange}
              variant="outlined"
              margin="dense"
              required
            />
            <TextField
              label="Payment Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={paymentData.date}
              onChange={handleDateChange}
              variant="outlined"
              margin="dense"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default StoreProfile;
