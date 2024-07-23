import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Container, Typography, Tabs, Tab, Box, Paper, TextField, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Button, Autocomplete, Grid, TableContainer, Snackbar, Alert, Stack, IconButton } from '@mui/material';
import {  Delete,  } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getProductNames } from '../features/productSlice';
import {  generateInvoice, getCustomer, saveInvoice } from '../features/invoiceSlice';

const Invoice = () => {
  const productState = useSelector((state)=>state.product);
  const [tabValue, setTabValue] = useState(0);
  const {user} = useSelector((state) => state.auth);
  const [formValue,setFormValue] = useState({
    invoiceNum:'',
    amount:''
  })
  const [formData, setFormData] = useState({
    itemQuantity: 0,
    product:null
  });

  const [customer , setCustomer] = useState(null)

  

  const [productOptions, setProductOptions] = useState(false);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const handleShowNotification = (message, severity) => {
      setNotificationMessage(message);
      setNotificationSeverity(severity);
      setNotificationOpen(true);
    };
  
 
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
   const productInputRef = useRef(null);

  useEffect(() => { 
    if (items.length > 0) {
      productInputRef.current.focus();
    }
  }, [items]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    if (name === 'product' && value) {
      // Assuming 'productState.products' is an array of products with 'productName', 'productPrice', and 'productGST' fields
      const selectedProduct = productState.products.find((product) => product._id === value._id);
  
      if (selectedProduct) {
        
        setFormData((prevData) => ({
          ...prevData,
          itemName: selectedProduct.productName,
        
          itemPrice: selectedProduct.productPrice || 0,
          gstPercentage: selectedProduct.productGST || 0,
        }));
      }
    }
  };
  
  

  const handleAddItem = () => {

    if (formData.itemQuantity && formData.product) {
      
      const newItem = {
        id: items.length + 1,
        quantity: parseInt(formData.itemQuantity, 10),
        product: formData.product,
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setFormData({
        itemQuantity: 0,
        product: null,
      });
    }
  };

  const indexToEditableField = (index, field, value) => {
  if (field === 'quantity') {
    return (
     
        <TextField
          type="number"
          value={value}
          onChange={(e) => handleQuantityChange(index, e.target.value)}
        />
      
   
    );
  }
  return <span>{value}</span>;
};

const handleQuantityChange = (index, newQuantity) => {
  // Update the quantity for the item at the specified index
  const updatedItems = items.map((item, i) =>
    i === index ? { ...item, quantity: newQuantity } : item
  );
  setItems(updatedItems);
};



  const getBasePrice = (product) => {
    return (
      (product?.inclusiveOfGST ? product?.productPrice / ((100 + product?.productGST) / 100) : product?.productPrice) ||
      0
    );
  };

  
  

  // eslint-disable-next-line arrow-body-style
  const calculateTotal = () => {
    return items.reduce((total, ele) => total + (getBasePrice(ele?.product) * +ele.quantity), 0);
  };

  const calculateTotalWithGST = () => {
    const totalBeforeGST = calculateTotal();
   
    const gstAmount = items.reduce(
      (total, ele) => total + (getBasePrice(ele?.product) * (ele?.product?.productGST / 100) * +ele.quantity || 0),
      0
    );
    
    return totalBeforeGST + gstAmount;
  };



  const handleDeleteItem = (itemId) => {
    // Remove the item by ID
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };

  const createInvoice = () =>{
   
    const products = items.map(ele=>{
      const product = ele.product._id
     
      return {quantity : ele.quantity, product}
    })
     if (!products.length) {
       handleShowNotification('Pelase Add Products', 'error');
       return;
     }
    if(!customer || !customer.agent?._id){
       handleShowNotification('Pelase Enter Valid Phone Number', 'error');
       return
    }

    const invoice = {
      store: user._id,
      customer: customer._id,
      agent: customer.agent._id,
      totalAmount: calculateTotal().toFixed(2),
      products,
    };
    

 
    
    dispatch(generateInvoice(invoice))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message || 'network error', 'error');
          return;
        }
 window.open(result.payload, '_');
 setItems([])
setCustomer(null)
          handleShowNotification('Invoice Created Successfully', 'success');
       
      })
      .catch((error) => {
        handleShowNotification('Error occurred Creating Invoice', 'error');
      });
  }





  return (
    <>
      <Helmet>
        <title>Generate Invoice</title>
      </Helmet>

      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
          Generate Invoice
        </Typography>
        <Snackbar
          open={notificationOpen}
          autoHideDuration={6000}
          onClose={() => setNotificationOpen(false)}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <Alert variant="filled" onClose={() => setNotificationOpen(false)} severity={notificationSeverity}>
            {notificationMessage}
          </Alert>
        </Snackbar>
        <Paper>
          <Box p={3} pb={0}>
            <TextField
              type="text"
              label=" Customer Phone Number"
              name="phoneNumber"
              onKeyUp={(e) => {
                if (customer && e.target.length !== 10) {
                  setCustomer(null);
                }
                if (e.key === 'Enter') {
                  if (e.target.value.length !== 10) {
                    handleShowNotification('Pelase Enter Valid Phone Number', 'error');
                  } else {
                    dispatch(getCustomer({ phone: e.target.value }))
                      .then((result) => {
                        if (result.meta.requestStatus === 'rejected') {
                          handleShowNotification(result.payload.message || 'network error', 'error');
                          return;
                        }

                        setCustomer(result.payload.customer);
                      })
                      .catch((error) => {
                        handleShowNotification('Error occurred Fetching Customer', 'error');
                     
                      });
                  }
                }
              }}
              size="small"
            />
          </Box>
          <Grid container spacing={3} p={3}>
            <Grid item xs={12} sm={6} md={3}>
              Customer Name : {customer?.name}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              Agent Name : {customer?.agent?.name}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              Agent Phone : {customer?.agent?.phoneNumber}
            </Grid>
          </Grid>
        </Paper>

        {!!customer && (
          <>
            <Paper sx={{ width: '100%', marginY: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ justifyContent: 'space-evenly' }}>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
              </Tabs>
            </Paper>
            <Paper>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TabPanel value={tabValue} index={0}>
                  <Stack spacing={3}>
                    <Box>
                      <TextField
                        type="number"
                        label="Invoice Number"
                        name="invoiceNum"
                        value={formValue.invoiceNum}
                        onChange={(e) => {
                          setFormValue({ ...formValue, invoiceNum: e.target.value });
                        }}
                      />
                    </Box>
                    <Box>
                      <TextField
                        type="number"
                        label="Base Amount"
                        name="amount"
                        value={formValue.amount}
                        onChange={(e) => {
                          setFormValue({ ...formValue, amount: e.target.value });
                        }}
                      />
                    </Box>
                  </Stack>
                  <Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginLeft: 10, marginTop: 10 }}
                      onClick={() => {
                        dispatch(
                          saveInvoice({
                            ...formValue,
                            store: user._id,
                            customer: customer._id,
                            agent: customer.agent._id,
                          })
                        )
                          .then((result) => {
                            if (result.meta.requestStatus === 'rejected') {
                              handleShowNotification(result.payload.message || 'network error', 'error');
                              return;
                            }
                            handleShowNotification('Invoice Added Successfully', 'success');
                            setCustomer(result.payload.customer);
                          })
                          .catch((error) => {
                            handleShowNotification('Error occurred Saving Invoice', 'error');
                          });
                      }}
                    >
                      Create Invoice
                    </Button>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>GST %</TableCell>
                          <TableCell>GST amount</TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((ele, index) => (
                          <TableRow key={`tb-${index}`}>
                            <TableCell width={'20%'}>{ele.product.productName}</TableCell>

                            <TableCell> {indexToEditableField(index, 'quantity', ele.quantity)}</TableCell>
                            <TableCell>{getBasePrice(ele?.product).toFixed(2)}</TableCell>
                            <TableCell>{ele?.product?.productGST || 0}</TableCell>
                            <TableCell>
                              {(
                                getBasePrice(ele?.product) * (ele?.product?.productGST / 100) * +ele.quantity || 0
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>{(getBasePrice(ele?.product) * +ele.quantity).toFixed(2) || 0}</TableCell>
                            <TableCell>
                              {(
                                (getBasePrice(ele?.product) +
                                  getBasePrice(ele?.product) * (ele?.product?.productGST / 100)) *
                                  +ele.quantity || 0
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <IconButton color="secondary" onClick={() => handleDeleteItem(ele.id)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell width={'30%'}>
                            <Autocomplete
                              fullWidth
                              options={productState?.products || []}
                              id="product"
                              value={formData.product}
                              onChange={(event, newValue) => {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  product: newValue,
                                }));
                              }}
                              isOptionEqualToValue={(option, value) => option?._id === value?._id}
                              getOptionLabel={(option) => `${option.productName} --- ${option.productId}`}
                              noOptionsText={productOptions ? 'No product found' : 'Enter 3 or more letters'}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  label="Product"
                                  name="product"
                                  value={
                                    formData.product
                                      ? `${formData.product.productName} --- ${formData.product._id}`
                                      : ''
                                  }
                                  onChange={(e) => {
                                    if (e.target.value.length >= 3)
                                      dispatch(getProductNames({ search: e.target.value }));
                                  }}
                                  inputRef={productInputRef}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              type="number"
                              label="Quantity"
                              name="itemQuantity"
                              value={formData.itemQuantity}
                              onChange={(e) => {
                                setFormData({ ...formData, itemQuantity: e.target.value });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddItem();
                                }
                              }}
                              variant="outlined"
                              required
                            />
                          </TableCell>
                          <TableCell>{getBasePrice(formData?.product).toFixed(2)}</TableCell>
                          <TableCell>{formData?.product?.productGST || 0.0}</TableCell>
                          <TableCell>
                            {(
                              getBasePrice(formData?.product) *
                                (formData?.product?.productGST / 100) *
                                +formData.itemQuantity || 0
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {(getBasePrice(formData?.product) * +formData.itemQuantity).toFixed(2) || 0}
                          </TableCell>
                          <TableCell>
                            {(
                              (getBasePrice(formData?.product) +
                                getBasePrice(formData?.product) * (formData?.product?.productGST / 100)) *
                                +formData.itemQuantity || 0
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={5}>Total Before GST:</TableCell>
                          <TableCell colSpan={5}>{calculateTotal().toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5}>Total GST:</TableCell>
                          <TableCell colSpan={5}>{(calculateTotalWithGST() - calculateTotal()).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5}>Total:</TableCell>
                          <TableCell colSpan={5}>{(calculateTotalWithGST()).toFixed(2)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={createInvoice}
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    Generate Invoice
                  </Button>
                </TabPanel>
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

const TabPanel = (props) => {
  const { children, value, index ,sx, ...other } = props;

  return (
    <Box width={'100%'} role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other} >
      {value === index && (
        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</Box>
      )}
    </Box>
  );
};

export default Invoice;
