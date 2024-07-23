import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Card, Grid, useMediaQuery, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlice';

function Login() {
  const [formData, setFormData] = useState({
    emailOrPhoneNumber: '',
    password: '',
  });
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const dispatch = useDispatch();

  const { user, token, error, loginError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      navigate('/dashboard/app');
    }
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(login(formData));
  };

  return (
    <Grid container style={{ height: '100vh', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
      {!isMobile && ( // Show the image only on screens wider than 600px
        <Grid item xs={12} sm={6} style={{ overflow: 'hidden', minWidth: '50%' }}>
          <img
            src="https://cdn.pixabay.com/photo/2020/04/17/19/48/city-5056657_640.png"
            alt="img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Card
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <main className="MuiStack-root css-1w7lnam">
            <Link to="/" />
            <div className="MuiStack-root css-176oz7c">
              <Typography variant="h3" className="MuiTypography-h3 css-1l1rjn0">
                Hi, Welcome back
              </Typography>
            </div>
            <div className="MuiStack-root css-syvkei">
              <form onSubmit={handleSubmit}>
                <div className="MuiStack-root css-j65z08">
                  <Typography variant="h4" className="MuiTypography-h4 css-sko12q">
                    Sign in to LifeStore
                  </Typography>
                </div>
                {(loginError || error) && (
                  <div >
                    <Alert severity="error">{loginError || error}</Alert>
                  </div>
                )}
                <div className="MuiStack-root css-1i43dhb">
                  <div className="MuiFormControl-root MuiTextField-root css-feqhe6">
                    <TextField
                      fullWidth
                      label="Email"
                      name="emailOrPhoneNumber"
                      value={formData.emailOrPhoneNumber}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </div>
                  <div className="MuiFormControl-root MuiTextField-root css-feqhe6">
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </div>
                  <Link
                    to="/forgotPassword"
                    className="MuiTypography-body2 MuiLink-root MuiLink-underlineAlways css-m44qpk"
                  >
                    Forgot password?
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    className="MuiButton-contained MuiButton-containedInherit MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButton-colorInherit MuiButton-disableElevation MuiButton-fullWidth"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Login;
