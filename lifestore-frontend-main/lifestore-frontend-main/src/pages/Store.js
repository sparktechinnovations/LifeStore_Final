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
  Grid,
  CircularProgress,
} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import AppWidgetSummary from '../sections/@dashboard/app/AppWidgetSummary';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { deleteStores, storeList } from '../features/storeSlice';

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
  { id: 'storeName', label: 'Store Name', alignRight: false },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'totalCommission', label: 'Commission', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
];

export default function Store() {
  const [selected, setSelected] = useState([]);
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
    dispatch(storeList({ params: searchParams }));
  }, [dispatch, searchParams]);

  const storeState = useSelector((state) => state.store);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = storeState.stores.map((store) => store._id);
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
    dispatch(deleteStores({ idArray: selectedForDeletion.filter((id) => id !== null) }))
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


  const isNotFound = !storeState.store?.length && !!searchParams.get('search');

  return (
    <>
      <Helmet>
        <title>Stores </title>
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
          <BreadcrumbsComponent lastBreadcrumb="Stores" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Stores
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={Link}
            to="/dashboard/newStore"
            style={{ backgroundColor: 'black' }}
          >
            New Store
          </Button>
        </Stack>

        <Grid container spacing={3} mb={2} justifyContent={'center'}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Commissions"
              total={(+storeState?.totalCommissions?.commission || 0).toFixed(2)}
              color="info"
            />
          </Grid>
        </Grid>


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
                        setSearchParams(searchParams);
                      }}
                      placeholder="Search Stores..."
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
                    <InputLabel htmlFor="toData">To</InputLabel>
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
                <Stack justifyContent="center" display={'flex'} alignItems={'center'} mt={3} width={'100%'}>
                  <Button onClick={handleReset} variant="outlined" sx={{ width: '100%', maxWidth: '10rem' }}>
                    Reset
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set(
                      'asc',
                      (storeState.order === 'asc' && 'false') || (storeState.order === 'desc' && 'true')
                    );
                    setSearchParams(searchParams);
                  }}
                  order={storeState.order}
                  sortType={storeState.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={storeState.stores?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {storeState.storeListLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    storeState?.stores?.map((store, index) => {
                      const { _id, storeName, phoneNumber, email, totalCommission, createdAt } = store;
                      const selectedStore = selected.indexOf(storeName) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedStore}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedForDeletion.includes(_id)}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell align="center">{serialNumber}</TableCell>
                          <TableCell scope="row" padding="none" component={Link} to={`/dashboard/storeProfile/${_id}`}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {storeName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${_id}`}>
                            {phoneNumber}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${_id}`}>
                            {email || 'N/A'}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${_id}`}>
                            {totalCommission?.toFixed(2) || 0}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${_id}`}>
                            {new Date(createdAt).toLocaleDateString('en-GB')}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {!storeState?.storeListLoader && !isNotFound && !storeState?.documentCount && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No stores found!
                          </Typography>

                          <Typography variant="body2">Add stores to see store List</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {isNotFound && storeState.stores?.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
            count={storeState.documentCount}
            rowsPerPage={storeState.limit}
            page={storeState.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
