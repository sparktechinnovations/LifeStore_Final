import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  useTheme,
  InputAdornment,
  styled,
  OutlinedInput,
  alpha,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  InputLabel,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { invoiceList } from '../features/invoiceSlice';

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
  { id: '', label: 'Sl.No', alignRight: false },
  { id: 'invoiceNum', label: 'Invoice Number', alignRight: false },
  { id: 'invoiceAmt', label: 'Invoice Amount', alignRight: false },
  { id: 'invoiceDate', label: 'Invoice Date', alignRight: false },
  { id: 'name', label: 'Customer Name', alignRight: false },

  { id: 'storeName', label: 'Store Name', alignRight: false },
];

export default function InvoicePage() {
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
    dispatch(invoiceList({ params: searchParams }));
  }, [dispatch, searchParams]);

  const invoiceState = useSelector((state) => state.invoice);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = invoiceState?.invoices.map((invoice) => invoice._id);
      setSelected(newSelecteds);
      setSelectedForDeletion(newSelecteds);
      return;
    }
    setSelectedForDeletion([]);
    setSelected([]);
  };

  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  //   const handleDeleteConfirmation = () => {
  //     dispatch(deleteinvoices({ idArray: selectedForDeletion.filter((id) => id !== null) }))
  //       .then((result) => {
  //         if (result.meta.requestStatus === 'rejected') {
  //           handleShowNotification(result.payload.message || 'network error', 'error');
  //           return;
  //         }
  //         handleShowNotification('Deletion successful!', 'success');
  //         setSelectedForDeletion([]);
  //         setSelected([]);
  //       })
  //       .catch((error) => {
  //         handleShowNotification('Error occurred during deletion', 'error');
  //         console.error('Deletion error:', error);
  //         setSelectedForDeletion([]);
  //         setSelected([]);
  //       });
  //   };

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
  const handleFilterByName = (event) => {
    setSearchTerm(event.target.value);
    searchParams.set('search', event.target.value);
    setSearchParams(searchParams);
  };

  const handleOnClick = () => {
    window.open();
  };

  const handleReset = () => {
    setSearchParams('');
  };

  const isNotFound = !invoiceState?.invoices?.length && !!searchParams.get('search');

  return (
    <>
      <Helmet>
        <title>Invoice </title>
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
          <BreadcrumbsComponent lastBreadcrumb="invoice" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Invoices
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
          <Grid container spacing={3} alignItems="flex-end" padding={2}>
            <Grid item xs={12} sm={6} md={4}>
              <StyledSearch
                fullWidth
                value={searchParams.get('search') || ''}
                onChange={(event) => {
                  searchParams.set('search', event.target.value);
                  setSearchParams(searchParams);
                }}
                placeholder="Search Invoices.."
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledSearch
                fullWidth
                value={searchParams.get('customerSearch') || ''}
                onChange={(event) => {
                  searchParams.set('customerSearch', event.target.value);
                  setSearchParams(searchParams);
                }}
                placeholder="Search Customers.."
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledSearch
                fullWidth
                value={searchParams.get('storeSearch') || ''}
                onChange={(event) => {
                  searchParams.set('storeSearch', event.target.value);
                  setSearchParams(searchParams);
                }}
                placeholder="Search Stores.."
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>
          </Grid>
          <Stack justifyContent="center" display={'flex'} alignItems={'center'} width={'100%'} mb={3}>
            <Button onClick={handleReset} variant="outlined" sx={{ width: '100%', maxWidth: '10rem' }}>
              Reset
            </Button>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  checkbox={false}
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set(
                      'asc',
                      (invoiceState?.order === 'asc' && 'false') || (invoiceState?.order === 'desc' && 'true')
                    );
                    setSearchParams(searchParams);
                  }}
                  order={invoiceState?.order}
                  sortType={invoiceState?.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={invoiceState?.invoices?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {invoiceState?.invoiceListLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoiceState?.invoices.map((invoice, index) => {
                      const { _id, invoiceNum, amount, createdAt, customer, agent, store } = invoice;
                      const selectedinvoice = selected.indexOf(_id) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedinvoice}
                          style={{ textDecoration: 'none' }}
                        >
                          <>
                            <TableCell align="center">{serialNumber}</TableCell>
                            <TableCell scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {invoiceNum}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">{amount.toFixed(2)}</TableCell>

                            <TableCell align="center">{new Date(createdAt).toLocaleDateString('en-GB')}</TableCell>
                            <TableCell align="center">{customer?.name || 'N/A'}</TableCell>

                            <TableCell align="center">{store?.storeName || 'N/A'}</TableCell>
                          </>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {!invoiceState?.invoiceListLoader && !invoiceState?.documentCount && !isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ p: 0 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                            borderRadius: '0',
                            p: 3,
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No invoices found!
                          </Typography>

                          <Typography variant="body2">Add invoices to see invoice List</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!invoiceState?.invoiceListLoader && isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ p: 0 }}>
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
            count={invoiceState?.documentCount}
            rowsPerPage={invoiceState?.limit}
            page={invoiceState?.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
