import React, { useState } from 'react';
import { useDispatch  } from 'react-redux';
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
import AvatarUploader from '../../components/AvatarUploader';
import '../../components/NewAvatar.css';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { createAgent } from '../../features/agentSlice';


export default function NewAgent() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    pan: '',
    aadhar: '',
    accNo: '',
    cat: '',
    gender: '',
    dob: '',
    branchName:'',
    bankName:'',
    ifscCode:'',
    password: '',
    profilePic: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');





  const inputWithShadowStyle = {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
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
           obj[key] = typeof value === 'string'? value.trim():value;
         }
       });
    dispatch(createAgent(obj))
      .then((result) => {
    

        if (result.meta.requestStatus ==='rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }

        handleShowNotification('Agent Created successfully', 'success');
        setTimeout(() => {
          navigate('/dashboard/agent');
        }, 1000);
      })
      .catch((error) => {
      
        handleShowNotification('Error occurred during creation', 'error');
      });   
  };

  const displayAddress = formData.address.replace(/\n/g, '\n');

  return (
    <Container maxWidth="sm">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="New Agent" />
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Agent
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
            label="Address"
            name="address"
            value={displayAddress}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="PAN Number"
            name="pan"
            value={formData.pan}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              handleChange(e);
            }}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />
          <TextField
            fullWidth
            label="Aadhar Number"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
          />
          <TextField
            fullWidth
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />
          <TextField
            fullWidth
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />
           <TextField
            fullWidth
            label="Branch Name"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />
          <TextField
            fullWidth
            label="Account Number"
            name="accNo"
            value={formData.accNo}
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
            InputLabelProps={{
              shrink: true,
            }}
            style={inputWithShadowStyle}
          />
          <FormControl fullWidth variant="outlined" margin="normal" style={inputWithShadowStyle}>
            <InputLabel>Category</InputLabel>
            <Select label="CAT" name="cat" value={formData.cat} onChange={handleChange}>
              <MenuItem value="LIC">LIC</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal" style={inputWithShadowStyle}>
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
            style={inputWithShadowStyle}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Add Agent
          </Button>
        </form>
      </Card>
    </Container>
  );
}
