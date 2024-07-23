import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AvatarUploader from '../components/AvatarUploader';
import { getCustomer, resetEditCustomer } from '../features/customerSlice';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';

const useStyles = makeStyles({
  unhighlightedTextField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important',
    },
    '&:hover': {
      cursor: 'not-allowed',
    },
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
});

function CustomerProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getCustomer({ id }));
  }, [dispatch, id]);

  const { customer, getCustomerLoader, getCustomerSuccess, getCustomerError } = useSelector((state) => state.customer);

  if (getCustomerLoader) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        Loading...
      </div>
    );
  }

  if (!customer || !getCustomerSuccess || getCustomerError) {
    return <div>Error loading Customer profile data</div>;
  }

  return (
    <>
    <BreadcrumbsComponent lastBreadcrumb={"Customer Profile"} />
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
                <AvatarUploader profilePic={customer?.customer?.profilePic?.url} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            {getCustomerLoader ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                Loading...
              </div>
            ) : (
              <CardContent sx={{my:3}}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={customer?.customer?.name || 'N/A'}
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
                    value={customer?.customer?.email || 'N/A'}
                    style={{ width: '45%' }}
                    variant="outlined"
                    inputProps={{
                      readOnly: true,
                      style: { borderColor: 'transparent' }, // Remove the border
                    }}
                    className={classes.unhighlightedTextField}
                  />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={customer?.customer?.phoneNumber || 'N/A'}
                    style={{ width: '45%' }}
                    variant="outlined"
                    inputProps={{
                      readOnly: true,
                      style: { borderColor: 'transparent' }, // Remove the border
                    }}
                    className={classes.unhighlightedTextField}
                  />
                  <TextField
                    label="Gender"
                    name="gender"
                    value={customer?.customer?.gender || 'N/A'}
                    style={{ width: '45%' }}
                    variant="outlined"
                    inputProps={{
                      readOnly: true,
                      style: { borderColor: 'transparent' }, // Remove the border
                    }}
                    className={classes.unhighlightedTextField}
                  />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Aadhar Number"
                    name="aadhar"
                    value={customer?.customer?.aadhar || 'N/A'}
                    style={{ width: '45%' }}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    className={classes.unhighlightedTextField}
                  />
                  <TextField
                    label="PAN Number"
                    name="pan"
                    value={customer?.customer?.pan || 'N/A'}
                    style={{ width: '45%' }}
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
                    value={customer?.customer?.address || 'N/A'}
                    style={{ width: '45%' }}
                    variant="outlined"
                    multiline
                    rows={4}
                    inputProps={{
                      readOnly: true,
                      style: { borderColor: 'transparent' }, // Remove the border
                    }}
                    className={classes.unhighlightedTextField}
                  />
                  <TextField
                    label="Date Of Birth"
                    name="dob"
                    value={new Date(customer?.customer?.dob).toLocaleDateString('en-GB') || 'N/A'}
                    style={{ width: '45%' }}
                    variant="outlined"
                    multiline
                    rows={4}
                    inputProps={{
                      readOnly: true,
                      style: { borderColor: 'transparent' }, // Remove the border
                    }}
                    className={classes.unhighlightedTextField}
                  />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="container"
                    component={Link}
                    to={`/dashboard/editCustomer/${id}`}
                    style={{ backgroundColor: 'black', color: 'white' }}
                    onClick={() => {
                      dispatch(resetEditCustomer());
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </form>
    </>
  );
}

export default CustomerProfile;
