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
  MenuItem,
  Stack,
  Alert,
  Snackbar,
  Autocomplete,
} from '@mui/material';
import AvatarUploader from '../../components/AvatarUploader';
import { getCustomer, editCustomer } from '../../features/customerSlice';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { getAgentNames } from '../../features/agentSlice';

function Editcustomer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [imageSrc, setImageSrc] = useState('');
  const [agentOptions, setAgentOptions] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    address: '',
    aadhar: '',
    pan: '',
    profilePic:null
  });

  const { customer, getCustomerLoader, getCustomerSuccess, getCustomerError,  editCustomerSuccess} =
    useSelector((state) => state.customer);
  const agentState = useSelector((state) => state.agent);

  useEffect(() => {
    dispatch(getCustomer({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (customer && customer?.customer && getCustomerSuccess) {
      setFormData((prevData) => ({
        ...prevData,
        name: customer?.customer?.name,
        phoneNumber: customer?.customer?.phoneNumber,
        email: customer?.customer?.email,
        dob: customer?.customer?.dob?.split('T')[0],
        address: customer?.customer?.address,
        gender: customer?.customer?.gender,
        aadhar: customer?.customer?.aadhar,
        pan: customer?.customer?.pan,
        password:'',
        profilePic:customer?.customer?.profilePic?.url
      }));
      if (customer?.customer?.profilePic?.url) {
        setImageSrc(customer?.customer?.profilePic?.url);
      }
    }
  }, [customer]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');
  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };
  
  

  if (getCustomerLoader) {
    return <div>Loading...</div>;
  }

    if (!customer.name && !getCustomerSuccess && getCustomerError) {
      return <Alert severity="error">Error loading Customer profile data</Alert>;
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
          customer?.customer[field] !== formData[field]
        ) {
          changedFields[field] = formData[field];
        }
      }
    });

    dispatch(editCustomer({ id, obj: changedFields }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification('Customer Edited successfully', 'success');
        setTimeout(() => {
          navigate(`/dashboard/customerProfile/${id}`);
        }, 1000);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Edition', 'error');
      }); 
  };


  const displayAddress = formData.address ? formData.address.replace(/\n/g, '\n') : '';

  return (
   <>
      <BreadcrumbsComponent lastBreadcrumb="EditCustomer" />

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
      
      <Grid container spacing={3} p={3}>
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
                  style={{ width: '45%' }}
                  variant="outlined"
                />
                <TextField
                  label="Email ID"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '45%' }}
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
                  style={{ width: '45%' }}
                  variant="outlined"
                />
                <FormControl fullWidth variant="outlined" margin="normal" style={{ width: '45%' }}>
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
                  style={{ width: '45%' }}
                  variant="outlined"
                />
            <TextField
            
                    label="Password"
                    name="password"
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                  style={{ width: '45%' }}
                  
                    variant="outlined"
                  />

              
              </Stack>
              <br />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                  label="PAN Number"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  style={{ width: '45%' }}
                  variant="outlined"
                />
               
                <TextField
                  label="Date Of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  style={{ width: '45%' }}
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
                  style={{ width: '45%' }}
                  variant="outlined"
                  multiline
                  rows={4}
                />
                       <Autocomplete
                  style={{ width: '45%' }}

            options={agentState?.agents || []}
            id="Agent"
            value={formData.agent}
            onChange={(event, newValue) => {
              setFormData((prevData) => ({
                ...prevData,
                agent: newValue,
              }));
            }}
            isOptionEqualToValue={(option, value) => option?.name === value?.name}
            getOptionLabel={(ele) => `${ele.name}  ---  ${ele.agentUid}`}
            noOptionsText={agentOptions ? 'No agent Found' : 'enter 3 or more letters'}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agent"
                name="agent"
                value={formData.agent ? `${formData.agent.name}  ---  ${formData.agent.agentUid}` : ''}
                
             
                variant="outlined"
        
                onChange={(e) => {
                  if (e.target.value.length >= 3) dispatch(getAgentNames({ search: e.target.value }));
                }}
               
              />
            )}
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

export default Editcustomer;
