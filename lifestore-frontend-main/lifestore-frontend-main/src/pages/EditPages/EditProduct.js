import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Alert, Stack, Autocomplete, FormControlLabel, Checkbox, Snackbar } from '@mui/material';

import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import AvatarUploader from '../../components/AvatarUploader';
import { editProduct, getProduct } from '../../features/productSlice';
import { getStoreNames } from '../../features/storeSlice';

function Edit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    store: null,
    productGST: '',
    picture: '',
    productPrice: '',
    inclusiveOfGST:true,
  });

  const [imageSrc, setImageSrc] = useState('');

  const { product, getProductLoader, getProductSuccess, getProductError, editProductLoader, editProductSuccess, editProductError } =
    useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getProduct({ id }));
  }, [dispatch, id]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');

  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  


  const storeState = useSelector((state) => state.store);
  

  useEffect(() => {
    if (product && product?.product && getProductSuccess) {
      setFormData((prevData) => ({
        ...prevData,
        productName: product?.product?.productName,
        productId: product?.product?.productId,
        store: product?.product?.store,
        productGST: product?.product?.productGST,
        productPrice: product?.product?.productPrice,
        picture: product?.product?.picture?.url || '',
        inclusiveOfGST: product?.product?.inclusiveOfGST,
      }));
      if (product?.product?.picture?.url) {
        setImageSrc(product?.product?.picture?.url);
      }
    }
  }, [product, getProductSuccess]);

  useEffect(() => {
    if (editProductSuccess) {
      navigate(`/dashboard/productProfile/${id}`);
    }
  });

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

  if (getProductLoader) {
    return <div>Loading...</div>;
  }


  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? event.target.files[0] : value,
    }));
  };

  const handleGoBack = () => {
    navigate('/dashboard/products');
  };

  const handleSubmit = (e) => {
   e.preventDefault();
   const changedFields = {};
    formData.store = formData.store._id

     Object.keys(formData).forEach((field) => {
   
       if (!(field === 'picture' && typeof formData[field] === 'string')) {
         if (
           formData[field] !== '' &&
           formData[field] !== null &&
           formData[field] !== undefined &&
           product?.product[field] !== formData[field]
         ) {
           changedFields[field] = formData[field];
         }
       }
     });

    dispatch(editProduct({ id, obj: changedFields }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        // setTimeout(() => {
        //   navigate(`/dashboard/storeProfile/${id}`);
        // }, 1000);

        handleShowNotification(`Product updated successfully`, 'success');
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Deleteion', 'error');
      });
  };

  return (
    <>
    <BreadcrumbsComponent lastBreadcrumb="EditProduct" />
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
        <form onSubmit={handleSubmit}>
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
                  label="Product Name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Product ID"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Stack>
              <br />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <TextField
                  label="Product Price"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <Autocomplete
                  fullWidth
                  options={storeState?.stores || []}
                  id="Store"
                  value={formData.store}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      store: newValue,
                    }));
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option?._id === value?._id;
                  }}
                  getOptionLabel={(ele) => `${ele?.storeName}  ---  ${ele?.storeUid}`}
                  
                  noOptionsText={!storeState?.stores?.length ? 'No store Found' : 'enter 3 or more letters'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Store"
                      name="store"
                      value={formData.store ? `${formData.store.storeName}  ---  ${formData.store.storeUid}` : ''}
                      onChange={(e) => {
                        if (e.target.value.length >= 3) dispatch(getStoreNames({ search: e.target.value }));
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </Stack>
              <br />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <TextField
                  label="Product GST"
                  name="productGST"
                  value={formData.productGST}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Stack>
              <Box flex={1}>
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
              </Box>
              <br />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'red', marginRight: '40px' }}
                  onClick={handleGoBack}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" style={{ backgroundColor: 'black' }}>
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
