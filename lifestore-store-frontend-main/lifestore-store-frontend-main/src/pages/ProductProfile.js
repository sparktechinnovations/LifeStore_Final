import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, CircularProgress, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AvatarUploader from '../components/AvatarUploader';
import { getProduct, resetEditProduct } from '../features/productSlice';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';

const useStyles = makeStyles({
  unhighlightedTextField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent !important',
    },
    '&:hover': {
      cursor: 'not-allowed',
    },
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
});

function ProductProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProduct({ id }));
  }, [dispatch, id]);

  const { product, getProductLoader, getProductSuccess, getProductError } = useSelector((state) => state.product);

  if (!product || !getProductSuccess || getProductError) {
    return <Alert severity='error'>Error loading Product profile data</Alert>;
  }

  return (
    <>
    <BreadcrumbsComponent lastBreadcrumb={"Product Profile"} />
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
              {getProductLoader ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} height="400px">
                  <CircularProgress />
                  Loading...
                </Box>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom textAlign={'center'}>
                    Profile Picture
                  </Typography>
                  <Box display="flex" justifyContent="center" marginBottom="16px" className="avatar-container">
                    <AvatarUploader profilePic={product?.product?.profilePic?.url} />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            {getProductLoader ? (
              <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} height="400px">
                <CircularProgress />
                Loading...
              </Box>
            ) : (
              <>
                <CardContent sx={{ my: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Product Name"
                      name="productName"
                      value={product?.product?.productName}
                      style={{ width: '45%' }}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { borderColor: 'transparent' }, // Remove the border
                      }}
                      className={classes.unhighlightedTextField}
                    />
                    <TextField
                      label="Product ID"
                      name="productId"
                      value={product?.product?.productId}
                      style={{ width: '45%' }}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { borderColor: 'transparent' }, // Remove the border
                      }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                      label="Product GST"
                      name="productGST"
                      value={product?.product?.productGST}
                      style={{ width: '45%' }}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { borderColor: 'transparent' }, // Remove the border
                      }}
                      className={classes.unhighlightedTextField}
                    />
                    <TextField
                      label="Store Name"
                      name="name"
                      value={product?.product?.store?.storeName}
                      style={{ width: '45%' }}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { borderColor: 'transparent' }, // Remove the border
                      }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <TextField
                      label="Product Price"
                      name="productPrice"
                      value={product?.product?.productPrice}
                      style={{ width: '45%' }}
                      variant="outlined"
                      inputProps={{
                        readOnly: true,
                        style: { borderColor: 'transparent' }, // Remove the border
                      }}
                      className={classes.unhighlightedTextField}
                    />
                  </div>

                  <br />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="container"
                      component={Link}
                      to={`/dashboard/editProduct/${id}`}
                      style={{ backgroundColor: 'black', color: 'white' }}
                      onClick={() => {
                        dispatch(resetEditProduct());
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </form>
    </>
  );
}

export default ProductProfile;
