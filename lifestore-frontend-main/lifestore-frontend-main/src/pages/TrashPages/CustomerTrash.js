import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  useMediaQuery,
  styled,
  Checkbox,
  Button,
  OutlinedInput,
  alpha,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { Restore } from '@mui/icons-material';
import Iconify from '../../components/iconify';

import Scrollbar from '../../components/scrollbar';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { getDeletedCustomer,restoreCustomers } from '../../features/customerSlice';
import { UserListHead } from '../../sections/@dashboard/user';

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 240,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

const TABLE_HEAD = [
  { id: 'sl.No', label: 'Sl.No', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
];

export default function CustomerTrash() {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForRestore, setSelectedForRestore] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

   const [notificationOpen, setNotificationOpen] = useState(false);
   const [notificationMessage, setNotificationMessage] = useState('');
   const [notificationSeverity, setNotificationSeverity] = useState('success');
   const handleShowNotification = (message, severity) => {
     setNotificationMessage(message);
     setNotificationSeverity(severity);
     setNotificationOpen(true);
   };

  const dispatch = useDispatch();
  const customerState = useSelector((state) => state.customer);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getDeletedCustomer({ params: searchParams }));
  }, [dispatch, searchParams]);

  const handleChangePage = (e, newPage) => {
    searchParams.set('page', newPage + 1);
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (e) => {
    searchParams.delete('page');
    searchParams.set('limit', e.target.value);
    setSearchParams(searchParams);
  };

  const isNotFound = !customerState?.customers?.length && !!searchTerm;

  const handleClick = (event, _id) => {
    const selectedIndex = selectedForRestore.indexOf(_id);
    let newSelected = [...selectedForRestore];

    if (selectedIndex === -1) {
      newSelected = [...newSelected, _id];
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    setSelected(newSelected);
    setSelectedForRestore(newSelected);
  };

  const handleSelectAllClick = (event) => {
    
    if (event.target.checked) {
      const newSelecteds = customerState?.customers.map((customer) => customer._id);
   
      setSelected(newSelecteds);
      setSelectedForRestore(newSelecteds);
      return;
    }
    setSelected([]);
    setSelectedForRestore([]);
  };

  const handleRestoreClick = () => {
    dispatch(restoreCustomers({ idArray: selectedForRestore.filter((id) => id !== null), params: searchParams }))
      .then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          handleShowNotification(result.payload.message || 'network error', 'error');
          return;
        }

        handleShowNotification('Restore successful!', 'success');
        setSelectedForRestore([]);
        setSelected([]);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during Restore', 'error');
       
        setSelectedForRestore([]);
        setSelected([]);
      });;
  };

  const handleFilterByName = (event) => {
    setSearchTerm(event.target.value);
    searchParams.set('search', event.target.value);
    setSearchParams(searchParams);
  };



  return (
    <>
      <Helmet>
        <title>Customer Trash</title>
      </Helmet>

      <Container>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <BreadcrumbsComponent lastBreadcrumb="customer" />
          <Snackbar
            open={notificationOpen}
            autoHideDuration={6000}
            onClose={() => setNotificationOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={() => setNotificationOpen(false)} severity={notificationSeverity}>
              {notificationMessage}
            </Alert>
          </Snackbar>
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
           Customer Trash
          </Typography>
        </Stack>

        <Card
          sx={{
            [theme.breakpoints.down('sm')]: {
              minWidth: '100%',
              boxShadow: 'none',
            },
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              margin: '15px',
              alignItems: 'center',
            }}
          >
            <StyledSearch
              value={searchTerm}
              onChange={(e) => handleFilterByName(e)}
              placeholder="Search Customer.."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              style={{ marginBottom: '10px', width: isMobile ? '100%' : '410px' }}
            />
            {selected.length > 0 || selectedForRestore.length > 0 ? (
              <Button
                variant="contained"
                startIcon={<Restore />}
                onClick={handleRestoreClick}
                style={{ backgroundColor: 'black', color: 'white', height: '40px' }}
              >
                Restore
              </Button>
            ) : (
              ''
            )}
          </div>

          <Scrollbar>
            <TableContainer >
              <Table>
                <UserListHead
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set(
                      'asc',
                      (customerState?.order === 'asc' && 'false') || (customerState?.order === 'desc' && 'true')
                    );
                    setSearchParams(searchParams);
                  }}
                  order={customerState?.order}
                  sortType={customerState?.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={customerState?.customers?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {customerState?.getDeletedCustomerLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerState?.customers?.map((customer, index) => {
                      const { _id, name, phoneNumber, email, createdAt } = customer;
                      const selectedCustomer = selected.indexOf(_id) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedCustomer}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedForRestore.includes(_id)}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell align="center">{serialNumber}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{phoneNumber}</TableCell>
                          <TableCell align="center">{email}</TableCell>
                          <TableCell align="center">{new Date(createdAt).toLocaleDateString('en-GB')}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>

                {!customerState?.getDeletedCustomerLoader && !customerState?.documentCount && !isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ p: 0 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                            borderRadius: '0',
                            p: 3,
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Customers found!
                          </Typography>

                          
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!customerState?.getDeletedCustomerLoader && isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ p: 0 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                            borderRadius: '0',
                            p: 3,
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{searchParams.get('search')}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={customerState?.documentCount}
            rowsPerPage={customerState?.limit}
            page={customerState?.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}