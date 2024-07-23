import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';

import AvatarUploader from '../../components/AvatarUploader';
import { getAgent, editAgent } from '../../features/agentSlice';

function EditAgent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [imageSrc, setImageSrc] = useState('');


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    address: '',
    aadhar: '',
    pan: '',
    accNo: '',
    profilePic: '',
  });

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');
  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const { agent, getAgentLoader, getAgentSuccess, getAgentError } =
    useSelector((state) => state.agent);
  useEffect(() => {
    dispatch(getAgent({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (agent && agent?.agent && getAgentSuccess) {
      setFormData((prevData) => ({
        ...prevData,
        name: agent?.agent?.name,
        phoneNumber: agent?.agent?.phoneNumber,
        email: agent?.agent?.email,
        dob: agent?.agent?.dob.split('T')[0],
        address: agent?.agent?.address,
        gender: agent?.agent?.gender,
        aadhar: agent?.agent?.aadhar,
        pan: agent?.agent?.pan,
        password:'',
        accNo: agent?.agent?.accNo,
        ifscCode:agent?.agent?.ifscCode,
        bankName:agent?.agent?.bankName,
        branchName:agent?.agent?.branchName,

        profilePic: agent?.agent?.profilePic?.url,
        cat: agent?.agent?.cat,
      }));
      if (agent?.agent?.profilePic?.url) {
        setImageSrc(agent?.agent?.profilePic?.url);
      }
    }
  }, [agent]);







  if (getAgentLoader) {
    return <div>Loading...</div>;
  }

  if (!agent.name && !getAgentSuccess && getAgentError) {
    return <Alert severity='error'>Error loading Agent profile data</Alert>;
  }


  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? event.target.files[0] : value,
    }));
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

  const handleGoBack = () => {
    window.history.back();
  };


  const handleSubmit = () => {
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



    dispatch(editAgent({ id, obj: changedFields }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification('Agent Edited successfully', 'success');
        setTimeout(() => {
          navigate(`/dashboard/agentProfile/${id}`);
        }, 1000);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Edition', 'error');
      });
  };

  const displayAddress = formData.address ? formData.address.replace(/\n/g, '\n') : '';

  return (
    <>
      <BreadcrumbsComponent lastBreadcrumb="EditAgent" />

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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Gender</InputLabel>
                    <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>

                    </Select>
                  </FormControl>
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    label="Aadhar Number"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="PAN Number"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

                   <TextField
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                     <TextField
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  </Stack>
                  <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                      <TextField
                    label="Branch Name"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Account Number"
                    name="accNo"
                    value={formData.accNo}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                 
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select label="CAT" name="cat" value={formData.cat} onChange={handleChange}>
                      <MenuItem value="LIC">LIC</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>

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

                </Stack>
                <br />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

                  <TextField
                    label="Address"
                    name="address"
                    value={displayAddress}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                   <TextField
                    label="Date Of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
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

export default EditAgent;
