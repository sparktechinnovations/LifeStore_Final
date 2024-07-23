import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Autocomplete,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AvatarUploader from '../../components/AvatarUploader';
import '../../components/NewAvatar.css';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { getAgentNames } from '../../features/agentSlice';
import { createCustomer } from '../../features/customerSlice';
import { sendOtp } from '../../features/authSlice';

export default function NewCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    pan: '',
    aadhar: '',
    gender: '',
    dob: '',
    password: 'Lifestore@123',
    agent: null,
    profilePic: null,
    secret:'',
    otp:''
  });

  const [agentOptions, setAgentOptions] = useState(false);
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState('');

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const agentState = useSelector((state) => state.agent);
const navigate = useNavigate();
const [timer, setTimer] = useState(60);
const [timerRunning, setTimerRunning] = useState(true);

useEffect(() => {
  let interval;
  if (timerRunning) {
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
  }
  if (timer === 0) {
    setTimerRunning(false);
  }
  return () => clearInterval(interval);
}, [timer, timerRunning]);


const handleResendOTP = () => {
dispatch(sendOtp({ phoneNumber: formData.emailOrPhoneNumber }))
.then((result) => {
if (result.meta.requestStatus === 'rejected') {
  handleShowNotification(result.payload.message, 'error');
  return;
}
setFormData({ ...formData, secret: result.payload.secret });
handleShowNotification('OTP sent successfully', 'success');
setTimer(60);
setTimerRunning(true);
})
.catch((error) => {
handleShowNotification('Error occurred sending OTP', 'error');
});
};
  

  const inputWithShadowStyle = {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  // const handlePasswordChange = (event) => {
  //   const { value } = event.target;
  //   if (isPasswordValid(value)) {
  //     setPasswordError('');
  //   } else {
  //     setPasswordError('Password must contain at least one uppercase letter, one special character, and one number.');
  //   }
  //   handleChange(event);
  // };

const handleSendOtp=(e)=>{
  e.preventDefault();
  dispatch(sendOtp({phoneNumber:formData.phoneNumber})).then((result) => {
   
    if (result.meta.requestStatus ==='rejected') {
      handleShowNotification(result.payload.message, 'error');
      return;
    }
    setFormData({...formData , secret:result.payload.secret})
    setOpenDialog(true);
    handleShowNotification('OTP sent successfully', 'success');
  })
  .catch((error) => {
    handleShowNotification('Error occurred sending OTP', 'error');
  });
}

const handleCloseDialog = () => {
  setOpenDialog(false);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'otp') {
    const numericPattern = /^[0-9]*$/;
    if (numericPattern.test(value) || value === '') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};

  const handleAgentChange = (event, value) => {
    setFormData((prevData) => ({
      ...prevData,
      agent: value || { id: '', name: '' },
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
    const obj = {}
Object.entries(formData).forEach(([key,value]) =>{
if(!!value){
  obj[key] = value
}
})
  dispatch(createCustomer({ obj: { ...obj, agent: formData.agent._id } }))
    .then((result) => {
     

       if (result.meta.requestStatus === 'rejected') {
         handleShowNotification(result.payload.message, 'error');
         return;
       }

      handleShowNotification('Customer Created successfully', 'success');
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 1000);
    })
    .catch((error) => {
      handleShowNotification('Error occurred during creation', 'error');
     
    });
  };



  return (
    <>
    <Container maxWidth="sm">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="New Customer" />
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Customer
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
        <form onSubmit={handleSendOtp}>
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
            label="Password"
            type='password'
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
          /> 

          <Autocomplete
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
                required
                value={formData.agent ? `${formData.agent.name}  ---  ${formData.agent.agentUid}` : ''}
                margin="normal"
                variant="outlined"
                onChange={(e) => {
                  if (e.target.value.length >= 3) dispatch(getAgentNames({ search: e.target.value }));
                }}
                style={inputWithShadowStyle}
              />
            )}
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            type="textArea"
            multiline
            rows={4}
            style={inputWithShadowStyle}
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
            style={inputWithShadowStyle}
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />

          <TextField
            fullWidth
            label="Adhar Number"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
          />

          <FormControl fullWidth variant="outlined" margin="normal" >
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={inputWithShadowStyle}
            >
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
            InputLabelProps={{
              shrink: true,
            }}
            style={inputWithShadowStyle}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
           Send OTP
          </Button>
        </form>
      </Card>
    </Container>
    <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Enter OTP</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="otp"
        label="OTP"
        type="text"
        fullWidth
        value={formData.otp}
        onChange={handleChange}
        name={'otp'}
      />
    </DialogContent>
    <DialogActions>
      <Button  variant="container" style={{ backgroundColor: 'blue', color: 'white', height: '55px' }} fullWidth onClick={handleSubmit}>
     Create Customer
      </Button>
      <Button
          fullWidth
          variant="contained"
          color={timerRunning ? 'grey' :'primary'}
          style={{height:'55px'}}
          onClick={handleResendOTP}
          disabled={timerRunning}
        >
          {timerRunning ? `Resend OTP (${timer}s)` : 'Resend OTP'}
        </Button>
    </DialogActions>
  </Dialog>
  </>
  );
}
