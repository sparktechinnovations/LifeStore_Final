import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Alert, Stack, Snackbar } from '@mui/material';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import AvatarUploader from '../../components/AvatarUploader';
import { getAdmin, editAdmin } from '../../features/adminSlice';

function Edit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    address: '',
    profilePic: null,
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

  const { admin, getAdminLoader, getAdminSuccess, getAdminError } =
    useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(getAdmin({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (admin && admin?.admin && getAdminSuccess) {
      setFormData((prevData) => ({
        ...prevData,
        name: admin?.admin?.name,
        phoneNumber: admin?.admin?.phoneNumber,
        email: admin?.admin?.email,
        address: admin?.admin?.address,
        gender: admin?.admin?.gender,
        password:'',
        dob: admin?.admin?.dob?.split('T')[0],
        profilePic: admin?.admin?.profilePic?.url,
      }));
      if (admin?.admin?.profilePic?.url) {
        setImageSrc(admin?.admin?.profilePic?.url);
      }
    }
  }, [admin]);

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

  if (getAdminLoader) {
    return <div>Loading...</div>;
  }

  if (!admin.name && !getAdminSuccess && getAdminError) {
    return <Alert>Error loading admin profile data</Alert>;
  }

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? event.target.files[0] : value,
    }));
  };

  const handleGoBack = () => {
    navigate(`/dashboard/profile/${id}`);
  };

  const handleSubmit = () => {
    const changedFields = {};
    Object.keys(formData).forEach((field) => {
      if (!(field === 'profilePic' && typeof formData[field] === 'string')) {
        if (
          formData[field] !== '' &&
          formData[field] !== null &&
          formData[field] !== undefined &&
          admin?.admin[field] !== formData[field]
        ) {
          changedFields[field] = formData[field];
        }
      }
    });

    dispatch(editAdmin({ id, obj: changedFields })).then((result) => {

      if (result.meta.requestStatus === 'rejected') {
        handleShowNotification(result.payload.message, 'error');
        return;
      }
      handleShowNotification('Admin Edited successfully', 'success');
      setTimeout(() => {
        navigate(`/dashboard/profile/${id}`);
      }, 1000);
    })
      .catch((error) => {
        handleShowNotification('Error occurred during Edition', 'error');
      });
  };



  const displayAddress = formData.address ? formData.address.replace(/\n/g, '\n') : '';



  return (
    <>
      <BreadcrumbsComponent lastBreadcrumb="EditAdmin" />

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
                  <AvatarUploader isEdit onFileChange={handleAvatarFileChange} profilePic={imageSrc} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Email ID"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                  />

                  <TextField
                    label="Date Of Birth"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                <br />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

                  <TextField
                    label="Address"
                    name="address"
                    value={displayAddress}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Stack>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: 'red', marginRight: '40px' }}
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                  <Button type="button" variant="contained" style={{ backgroundColor: 'black' }} onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default Edit;
