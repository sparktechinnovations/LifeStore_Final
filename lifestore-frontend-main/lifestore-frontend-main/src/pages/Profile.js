import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AvatarUploader from '../components/AvatarUploader';
import { getAdmin, resetEditAdmin } from '../features/adminSlice';
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

function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAdmin({ id }));
  }, [dispatch, id]);

  const { admin, getAdminLoader, getAdminSuccess, getAdminError } = useSelector((state) => state.admin);

  if (!admin || !getAdminSuccess || getAdminError) {
    return <div>Error loading admin profile data</div>;
  }

  return (
    <>
    <BreadcrumbsComponent lastBreadcrumb="Admin Profile" />

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
              {getAdminLoader ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} height="400px">
                  <CircularProgress />
                  Loading...
                </Box>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom textAlign={'center'}>
                    Profile Picture
                  </Typography>
                  <Box display="flex" justifyContent="center" marginBottom="16px" className="avatar-container">
                    <AvatarUploader profilePic={admin?.admin?.profilePic?.url} />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            {getAdminLoader ? (
              <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} height="400px">
                <CircularProgress />
                Loading...
              </Box>
            ) : (
              <>
                <CardContent sx={{ my: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Full Name"
                      name="name"
                      value={admin?.admin?.name || '-'}
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
                      value={admin?.admin?.email || '-'}
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
                      value={admin?.admin?.phoneNumber || '-'}
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
                      value={admin?.admin?.gender || '-'}
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
                      label="Address"
                      name="address"
                      value={admin?.admin?.address || ''}
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
                      value={new Date(admin?.admin?.dob || '').toLocaleDateString('en-GB')}
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
                      to={`/dashboard/edit/${id}`}
                      style={{ backgroundColor: 'black', color: 'white' }}
                      onClick={() => {
                        dispatch(resetEditAdmin());
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </form>
    </>
  );
}

export default Profile;
