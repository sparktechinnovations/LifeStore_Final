/* eslint-disable import/no-unresolved */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
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
  TextField,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
  Button,
 
} from '@mui/material';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead } from '../../sections/@dashboard/user';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { getStorePayments } from '../../features/storeSlice';

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
  { id: 'sl.no', label: 'Sl.No', align: 'center' },
  { id: 'store.storeName', label: 'Store Name', align: 'center' },
  { id: 'store.storeUid', label: 'Store ID', align: 'center' },
  { id: 'amount', label: 'Amount', align: 'center' },
  { id: 'date', label: 'Payment Date', align: 'center' },
];

export default function StorePayments() {
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStorePayments({ params: searchParams }));
  }, [searchParams, dispatch]);

  const storeState = useSelector((state) => state.store);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = storeState?.payments?.map((store) => store._id);
      setSelected(newSelecteds);
      setSelectedForDeletion(newSelecteds);
      return;
    }
    setSelectedForDeletion([]);
    setSelected([]);
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

const handleReset=()=>{
  setSearchParams("");
}

  const isNotFound = !storeState.payments?.length && !!searchParams.get('search') ;

  

  return (
    <>
      <Helmet>
        <title>Store Payments </title>
      </Helmet>

      <Container>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <BreadcrumbsComponent lastBreadcrumb="Store Payments" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Store Payments
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
          <Stack alignItems={'end'} m={3}>
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
                  placeholder="Search Store.."
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
                    searchParams.delete('page');
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
                    searchParams.delete('page');
                    setSearchParams(searchParams);
                  }}
                />
              </Box>
            </Stack>
            <Stack justifyContent='center' display={'flex'} alignItems={'center'} mt={3} width={'100%'}>
                  <Button onClick={handleReset} variant='outlined' sx={{width:'100%',maxWidth:'10rem'}}>Reset</Button>
                  </Stack>
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
                    searchParams.delete('page');
                    setSearchParams(searchParams);
                  }}
                  checkbox={false}
                  order={storeState.order}
                  sortType={storeState.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={storeState.payments?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {storeState?.getStorePaymentsLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : storeState?.getStorePaymentsError ? (
                    <>
                      <Alert severity="error">store Payments fetching error</Alert>
                    </>
                  ) : (
                    storeState?.payments?.map((stores, index) => {
                      const { _id, amount, date, store } = stores;

                      const selectedstore = selected.indexOf(store?.storeName) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedstore}>
                         
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${store._id}`}>{serialNumber}</TableCell>
                          <TableCell  scope="row" padding="none" component={Link} to={`/dashboard/storeProfile/${store._id}`}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {store?.storeName}
                                {store?.deleteStatus === 'true' && '(Deleted)'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${store._id}`}>{store?.storeUid}</TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${store._id}`}>{amount.toFixed(2)}</TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${store._id}`}>
                            {date ? new Date(date).toLocaleDateString('en-GB') : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>

                {!storeState?.getStorePaymentsLoader && !storeState?.documentCount && !isNotFound && (
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
                            No Payments found!
                          </Typography>

                         
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!storeState?.getStorePaymentsLoader && isNotFound && (
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
