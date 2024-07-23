import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Card,
  Alert,
  Snackbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import AvatarUploader from '../../components/AvatarUploader';
import '../../components/NewAvatar.css';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { createAdmin } from '../../features/adminSlice';

const useStyles = makeStyles((theme) => ({
  card: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    padding: theme.spacing(3),
    borderRadius: '12px', // Add border radius
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
}));

export default function NewAdmin() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: '',
    dob: '',
    password: '',
    profilePic:null
  });
  const [imageSrc, setImageSrc] = useState('');
 const [notificationOpen, setNotificationOpen] = useState(false);
 const [notificationMessage, setNotificationMessage] = useState('');
 const [notificationSeverity, setNotificationSeverity] = useState('success');
  const navigate = useNavigate();



  const inputStyle = {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px', // Add border radius
  };

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

  const dispatch = useDispatch();

   const handleShowNotification = (message, severity) => {
     setNotificationMessage(message);
     setNotificationSeverity(severity);
     setNotificationOpen(true);
   };

  const handleSubmit = (e) => {
      e.preventDefault();

      const obj = {};

      Object.entries(formData).forEach(([key, value]) => {
        if (!!value) {
          obj[key] = value;
        }
      });
  
    dispatch(createAdmin(obj))
      .then((result) => {
     

        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification('Agent Created successfully', 'success');
        setTimeout(() => {
          navigate('/dashboard/admin');
        }, 1000);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during creation', 'error');
      });   
  };

  return (
    <Container maxWidth="sm">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="New Admin" />
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Admin
      </Typography>
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
      <Card className={classes.card}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center" marginBottom="16px" className="avatar-container">
            <AvatarUploader isEdit onFileChange={handleAvatarFileChange} profilePic={imageSrc} />
          </Box>
          <TextField
            fullWidth
            label="Username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputStyle}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputStyle}
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
            style={inputStyle}
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
            style={inputStyle}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputStyle}
          />
          <FormControl fullWidth variant="outlined" margin="normal" required style={inputStyle}>
            <InputLabel>Gender</InputLabel>
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            InputLabelProps={{
              shrink: true,
            }}
            style={inputStyle}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className={classes.submitButton}>
            Add Admin
          </Button>
        </form>
      </Card>
    </Container>
  );
}
