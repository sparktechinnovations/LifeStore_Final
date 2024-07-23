import React, {  useState } from 'react';
import { TextField, Button, Container, Typography, Box, Card, Snackbar, Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStore } from '../../features/storeSlice';
import AvatarUploader from '../../components/AvatarUploader';
import '../../components/NewAvatar.css';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';

export default function NewStore() {
  const [formData, setFormData] = useState({
    storeName: '',
    gstNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    ownerName: '',
    password: '',
    agentPercentage: '',
    lifeStorePercentage: '',
    profilePic: '',
    documents: [],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();




  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');


  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const inputWithShadowStyle = {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePic: file,
    }));
  };

  const handlepdfChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      documents: file,
    }));
  };

  const displayAddress = formData.address.replace(/\n/g, '\n');

  const handleSubmit = (e) => {
    e.preventDefault();

      const obj = {};

      Object.entries(formData).forEach(([key, value]) => {
        if (!!value) {
          obj[key] = value;
        }
      });


    dispatch(createStore(obj))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification('Store Created successfully', 'success');
        setTimeout(() => {
          navigate(`/dashboard/store`);
        }, 1000);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during creation', 'error');
      }); ;
  };

  




  return (
    <Container maxWidth="sm">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="New Store" />
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
      <Typography variant="h4" align="center" gutterBottom>
        Add New Store
      </Typography>
      <Card
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box marginBottom="16px" className="avatar-container" display={'flex'} justifyContent={'center'}>
            <AvatarUploader isEdit onFileChange={handleFileChange} />
          </Box>

          <TextField
            fullWidth
            label="Store Name"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="GST Number"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            value={displayAddress}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
                  multiline
                    rows={4}
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            type="number"
            required
     
            
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Owner Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type='password'
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Agent Percentage"
            name="agentPercentage"
            value={formData.agentPercentage}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="LifeStore Percentage"
            name="lifeStorePercentage"
            value={formData.lifeStorePercentage}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <Typography variant="subtitle1" gutterBottom>
            License Copy
          </Typography>

          <input type="file" name="documents" id="documents" accept=".pdf" onChange={handlepdfChange} multiple />

          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Add Store
          </Button>
        </form>
      </Card>
    </Container>
  );
}
