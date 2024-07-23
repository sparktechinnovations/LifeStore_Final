import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Avatar,
  CssBaseline,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, } from 'react-redux';
import { sendForgotOtp } from '../features/authSlice';
import { forgotPassword } from '../features/agentSlice';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        newPassword:'',
        emailOrPhoneNumber:'',
        secret:'',
        otp:''
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
  const [openDialog, setOpenDialog] = useState(false);
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
  dispatch(sendForgotOtp({ phoneNumber: formData.emailOrPhoneNumber }))
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

      const handleOpenDialog = () => {
         dispatch(sendForgotOtp({phoneNumber:formData.emailOrPhoneNumber})).then((result) => {
   
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
        
      };
    
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

  const handleResetPassword = () => {
   dispatch(forgotPassword(formData)).then((result) => {
        
    if (result.meta.requestStatus ==='rejected') {
      handleShowNotification(result.payload.message, 'error');
      return;
    }
    handleShowNotification('Password Reset Successfully successfully', 'success');
    setTimeout(() => {
      navigate(`/login`);
    }, 1000);
  })
  .catch((error) => {
    handleShowNotification('Error occurred during Edition', 'error');
  }); 
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
<div style={{display:'flex',justifyContent:"center",alignItems:"center",height:"100%"}}>
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
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <form>
            <TextField
              margin="normal"
              fullWidth
              label="Phone Number"
              value={formData.emailOrPhoneNumber}
              name='emailOrPhoneNumber'
              variant="outlined"
              onChange={handleChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="New Password"
              value={formData.newPassword}
              name='newPassword'
              type="password"
              variant="outlined"
              onChange={handleChange}
              required
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
             Send OTP
            </Button>
          </form>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Back to Login
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      </div>
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
        <Button  variant="container" style={{ backgroundColor: 'blue', color: 'white', height: '55px' }} fullWidth onClick={handleResetPassword}>
       Update Password
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
};

export default ForgotPassword;
