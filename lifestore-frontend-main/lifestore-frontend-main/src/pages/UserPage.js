import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  useTheme,
  InputAdornment,
  styled,
  OutlinedInput,
  alpha,
  useMediaQuery,
  Snackbar,
  Alert,
  InputLabel,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { customerList, deleteCustomers } from '../features/customerSlice';


const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

const TABLE_HEAD = [
  { id: 'sl.no', label: 'Sl.No', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'totalSpending', label: 'Spending', alignRight: false },
  { id: 'agent', label: 'agent', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
];

export default function UserPage() {
  const [menuOpen, setMenuOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(customerList({ params: searchParams }));
  }, [dispatch, searchParams]);


  const customerState = useSelector((state) => state.customer);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customerState?.customers.map((customer) => customer._id);
      setSelected(newSelecteds);
      setSelectedForDeletion(newSelecteds);
      return;
    }
    setSelected([]);
    setSelectedForDeletion([]);
  };

  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleDeleteConfirmation = () => {
    dispatch(deleteCustomers({ idArray: selectedForDeletion?.filter((id) => id !== null) }))
      .then((result) => {
         if (result.meta.requestStatus === 'rejected') {
           handleShowNotification(result.payload.message || 'network error', 'error');
           return;
         }
        handleShowNotification('Deletion successful!', 'success');
        setSelectedForDeletion([]);
        setSelected([]);
      })
      .catch((error) => {
        handleShowNotification('Error occurred during deletion', 'error');
        console.error('Deletion error:', error);
        setSelectedForDeletion([]);
        setSelected([]);
      });
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selectedForDeletion.indexOf(_id);
    let newSelected = [...selectedForDeletion];

    if (selectedIndex === -1) {
      newSelected = [...newSelected, _id];
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedForDeletion(newSelected);
  };

  const handleChangePage = (e, newPage) => {
    searchParams.set('page', newPage + 1);
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (e) => {
    searchParams.delete('page');
    searchParams.set('limit', e.target.value);
    setSearchParams(searchParams);
  };

  const handleReset =()=>{
    setSearchParams("");
  }


  const isNotFound = !customerState?.customers?.length && !!searchTerm;

  return (
    <>
      <Helmet>
        <title>customers </title>
      </Helmet>

      <Container>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
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
          <BreadcrumbsComponent lastBreadcrumb="customers" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            customers
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={Link}
            to="/dashboard/newcustomer"
            style={{ backgroundColor: 'black' }}
          >
            New customer
          </Button>
        </Stack>

        <Card
          sx={{
            [theme.breakpoints.down('sm')]: {
              minWidth: '100%',
              boxShadow: 'none',
            },
          }}
        >
          <Stack alignItems={'end'} m={3}>
            {selected.length > 0 || selectedForDeletion.length > 0 ? (
              <Box>
                <Button
                  sx={{ color: 'white', backgroundColor: 'red', height: '50px', width: isMobile ? '100%' : '80px' }}
                  onClick={handleDeleteConfirmation}
                >
                  Delete
                </Button>
              </Box>
            ) : (
              <>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={'end'} width={'100%'}>
                  <Box width={'100%'}>
                    <StyledSearch
                      fullWidth
                      value={searchParams.get('search') || ''}
                      onChange={(event) => {
                        searchParams.set('search', event.target.value);
                       searchParams.delete('page');
                        setSearchParams(searchParams);
                      }}
                      placeholder="Search customers.."
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                      }
                    />
                  </Box>
                  <Box width={'100%'}>
                    <StyledSearch
                      fullWidth
                      value={searchParams.get('agentName') || ''}
                      onChange={(event) => {
                        searchParams.set('agentName', event.target.value);
                        searchParams.delete('page');
                        setSearchParams(searchParams);
                      }}
                      placeholder="Search agents.."
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                      }
                    />
                  </Box>
                  <Box width={'100%'}>
                    <InputLabel htmlFor="fromDate">From</InputLabel>
                    <TextField
                      fullWidth
                      name="fromDate"
                      type="date"
                      value={searchParams.get('startDate') || ''}
                      onChange={(event) => {
                        searchParams.set('startDate', event.target.value);
                        setSearchParams(searchParams);
                      }}
                    />
                  </Box>
                  <Box width={'100%'}>
                    <InputLabel htmlFor="toDate">To</InputLabel>
                    <TextField
                      fullWidth
                      name="toDate"
                      type="date"
                      value={searchParams.get('endDate') || ''}
                      onChange={(event) => {
                        searchParams.set('endDate', event.target.value);
                        setSearchParams(searchParams);
                      }}
                    />
                  </Box>
                 
                </Stack>
                <Stack justifyContent='center' display={'flex'} alignItems={'center'} mt={3} width={'100%'}>
                  <Button onClick={handleReset} variant='outlined' sx={{width:'100%',maxWidth:'10rem'}}>Reset</Button>
                  </Stack>
              </>
            )}
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
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
                  {customerState?.customerListLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerState?.customers?.map((customer, index) => {
                      const { _id, name, phoneNumber, email, totalSpending, createdAt, agent } = customer;
                      const selectedcustomer = selected.indexOf(name) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedcustomer}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedForDeletion.includes(_id)}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell align="left">{serialNumber}</TableCell>
                          <TableCell
                            scope="row"
                            padding="none"
                            component={Link}
                            to={`/dashboard/customerProfile/${_id}`}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" component={Link} to={`/dashboard/customerProfile/${_id}`}>
                            {phoneNumber}
                          </TableCell>
                          <TableCell align="left" component={Link} to={`/dashboard/customerProfile/${_id}`}>
                            {email || 'N/A'}
                          </TableCell>
                          <TableCell align="left" component={Link} to={`/dashboard/customerProfile/${_id}`}>
                            {totalSpending.toFixed(2)}
                          </TableCell>
                          <TableCell align="left" component={Link} to={`/dashboard/customerProfile/${_id}`}>
                            {agent?.name}
                          </TableCell>
                          <TableCell align="left" component={Link} to={`/dashboard/customerProfile/${_id}`}>
                            {new Date(createdAt).toLocaleDateString('en-GB')}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {!customerState?.customerListLoader && !isNotFound && !customerState?.documentCount && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No customers found!
                          </Typography>

                          <Typography variant="body2">Add customers to see customer List</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{searchTerm}&quot;</strong>.
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