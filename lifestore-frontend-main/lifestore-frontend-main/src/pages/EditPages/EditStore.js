import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  Typography,
  Stack,
  Alert,
  Snackbar,
 
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useDispatch, useSelector } from 'react-redux';
import AvatarUploader from '../../components/AvatarUploader';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';

import {  editStore, getStore, storeDocumentDelete } from '../../features/storeSlice';

function EditStore() {
  const [formData, setFormData] = useState({
    storeName: '',
   
    email: '',
    phoneNumber: '',
    address: '',
    ownerName: '',
    gstNumber: '',
    profilePic: '',
    documents:[],
    agentPercentage: 0,
    lifeStorePercentage: 0,
  });


  const dispatch = useDispatch();
  const { id } = useParams();
  const [imageSrc, setImageSrc] = useState('');

  const { store, getStoreLoader, getStoreSuccess, getStoreError, editStoreloader, editStoreSuccess, editStoreError } =
    useSelector((state) => state.store);
  useEffect(() => {
    dispatch(getStore({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (store && store?.store && getStoreSuccess) {
      setFormData((prevData) => ({
        ...prevData,
        storeName: store?.store?.storeName || '',
        phoneNumber: store?.store?.phoneNumber || '',
        email: store?.store?.email || '',
        address: store?.store?.address || '',
        ownerName: store?.store?.ownerName || '',
        gstNumber: store?.store?.gstNumber || '',
        profilePic: '' || '',
        agentPercentage: store?.store?.agentPercentage || '',
        lifeStorePercentage: store?.store?.lifeStorePercentage || '',
      }));
      if (store?.store?.profilePic?.url) {
      
        setImageSrc(store?.store?.profilePic?.url);
      }
    }
  }, [store, getStoreSuccess]);

   const [notificationOpen, setNotificationOpen] = useState(false);
   const [notificationMessage, setNotificationMessage] = useState('');
   const [notificationSeverity, setNotificationSeverity] = useState('success');

   const handleShowNotification = (message, severity) => {
     setNotificationMessage(message);
     setNotificationSeverity(severity);
     setNotificationOpen(true);
   };

  const handlepdfChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      documents: file,
    }));
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    const changedFields = {};
    Object.keys(formData).forEach((field) => {
      if (
        !(field === 'profilePic' && typeof formData[field] === 'string')    
      ) {
        
        if ((formData[field] !== '' && formData[field] !== null && formData[field] !== undefined) && store?.store[field] !== formData[field]) {
          changedFields[field] = formData[field];
        }
      }
      
    });

    

    dispatch(editStore({ id, obj: changedFields }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message, 'error');
          return;
        }
        setTimeout(() => {
          navigate(`/dashboard/storeProfile/${id}`);
        }, 1000);
        
        handleShowNotification(`Store updated successfully`, 'success');
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Deleteion', 'error');
      });
  };

  const handleFileDelete =(key,id)=>{
    dispatch(storeDocumentDelete({ key }))
      .then((result) => {
       
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message || 'network error', 'error');
          return;
        }
         dispatch(getStore({ id }));
        handleShowNotification(`Document with ${key.split('/').pop()} deleted successfully`, 'success');
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Deletion', 'error');
      });
  }

  const displayAddress = formData.address.replace(/\n/g, '\n');

  return (
    <>
      <div style={{ marginBottom: '20px', marginLeft: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbsComponent lastBreadcrumb="Edit Store" />
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
                <Box display="flex" justifyContent="center" marginBottom="16px" className="avatar-container">
                  <AvatarUploader isEdit onFileChange={handleAvatarFileChange} profilePic={imageSrc} />
                </Box>
                <Typography textAlign={'center'}>Store Uid : {store?.store?.storeUid}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    label="Store Name"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
                  />
                  <TextField
                    label="Email ID"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
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
                  />
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    label="Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
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
                  />
                
                </Stack>
                <br />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <TextField
                    fullWidth
                    label="Agent Percentage"
                    name="agentPercentage"
                    value={formData.agentPercentage}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    label="LifeStore Percentage"
                    name="lifeStorePercentage"
                    value={formData.lifeStorePercentage}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Stack>
                <br />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

                  <TextField
                    label="Address"
                    name="address"
                    value={displayAddress}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                  </Stack>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Uploaded Documents
                    </Typography>
                    <List>
                      {store?.store?.documents?.map((pdfFile, index) => (
                        <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
                          <a
                            href={pdfFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              textDecoration: 'none',
                              color: 'inherit',
                            }}
                          >
                            <PictureAsPdfIcon style={{ marginRight: '8px' }} />
                            <Typography variant="body2" gutterBottom style={{ flex: 1 }}>
                              {pdfFile.key.split('/').pop()}
                            </Typography>
                          </a>
                          <DeleteIcon
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => {
                              handleFileDelete(pdfFile.key, id);
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      New Documents
                    </Typography>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <input
                        type="file"
                        name="documents"
                        id="documents"
                        accept=".pdf"
                        onChange={handlepdfChange}
                        multiple
                      />
                    </div>
                  </Grid>
                </div>
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    
                    variant="contained"
                    style={{ backgroundColor: 'red', marginRight: '40px' }}
                    component={Link}
                    to={`/dashboard/storeProfile/${id}`}
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

export default EditStore;
