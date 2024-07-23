import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox, Card, Alert, Box,  Snackbar } from '@mui/material';

import '../../components/NewAvatar.css';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';

import AvatarUploader from '../../components/AvatarUploader';

import { createProduct } from '../../features/productSlice';

export default function NewProduct() {

  const [showProductGST, setShowProductGST] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
hsnNumber:'',
lifestoreDiscount:0,
    productId: '',
    productGST: '',
    picture: null,
    inclusiveOfGST: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storeState = useSelector((state) => state.store);
  const authState = useSelector((state) => state.auth);



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
      picture: file,
    }));

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
    });

    reader.readAsDataURL(file);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    formData.store = authState.user?._id;

    e.preventDefault();

    const obj = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!!value) {
        obj[key] = value;
      }
    });
 
    dispatch(createProduct(formData))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        handleShowNotification('Product Created successfully', 'success');
        setTimeout(() => {
          navigate(`/dashboard/products`);
        }, 1000);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during creation', 'error');
      });
  };



  return (
    <Container maxWidth="sm">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="New Product" />
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
        Add New Product
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
            <AvatarUploader isEdit onFileChange={handleAvatarFileChange} profilePic={imageSrc} />
          </Box>

          <TextField
            fullWidth
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Price in INR"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            type="number"
            required
            style={inputWithShadowStyle}
          />

          <TextField
            fullWidth
            label="Product ID"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
            required
          />
<TextField
            fullWidth
            label="HSN Number"
            name="hsnNumber"
            value={formData.hsnNumber}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
            required
          />
          <TextField
            fullWidth
            label="Customer Discount"
            name="lifestoreDiscount"
            value={formData.lifestoreDiscount}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            style={inputWithShadowStyle}
            
          />
         

          <TextField
            fullWidth
            label="Product GST in %"
            name="productGST"
            value={formData.productGST}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            inputProps={{
              maxLength: 3,
              type: 'tel',
            }}
            style={inputWithShadowStyle}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.inclusiveOfGST}
                onChange={(e) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    inclusiveOfGST: e.target.checked,
                  }));
                }}
              />
            }
            label="Inclusive of GST"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Add Product
          </Button>
        </form>
      </Card>
    </Container>
  );
}
