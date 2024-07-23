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
  Alert,
  TextField,
  InputLabel,
  Box,
  CircularProgress,
} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { storeCommissionList } from '../features/storeSlice';

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
  { id: 'storeData.storeName', label: 'Store Name', align: 'center' },
  { id: 'storeData._id', label: 'Store ID', align: 'center' },
  { id: 'pendingCommission', label: 'Commission To Be Recieved', align: 'center' },
  { id: 'storeData.credit', label: 'Credits', align: 'center' },
  { id: 'latestStorePaymentDate', label: 'Last Recieved On', align: 'center' },
];

export default function StoreCommissions() {
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(storeCommissionList({ params: searchParams }));
  }, [searchParams, dispatch]);

  const storeState = useSelector((state) => state.store);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = storeState.stores.map((store) => store._id);
      setSelected(newSelecteds);
      setSelectedForDeletion(newSelecteds);
      return;
    }
    setSelectedForDeletion([]);
    setSelected([]);
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

  const isNotFound = !storeState.stores?.length && !!searchParams.get('search') && storeState.storeCommissionSuccess;

  return (
    <>
      <Helmet>
        <title>stores </title>
      </Helmet>

      <Container>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <BreadcrumbsComponent lastBreadcrumb="Store Commission" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Store Commissions
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
                    setSearchParams(searchParams);
                  }}
                />
              </Box>
              <Box width={'100%'}>
                <InputLabel htmlFor="fromDate">To</InputLabel>
                <TextField
                  fullWidth
                  name="fromDate"
                  type="date"
                  value={searchParams.get('endDate') || ''}
                  onChange={(event) => {
                    searchParams.set('endDate', event.target.value);
                    setSearchParams(searchParams);
                  }}
                />
              </Box>
            </Stack>
          </Stack>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead
                  checkbox={false}
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
                  {storeState.getStoreLoader ? (
                    <tr>
                      <td colSpan={6}>
                        <CircularProgress />
                        Loading...
                      </td>
                    </tr>
                  ) : storeState.storeListError ? (
                    <>
                      <Alert severity="error">{storeState.storeListError}</Alert>
                    </>
                  ) : (
                    storeState?.storeCommisions?.map((store, index) => {
                      const { _id, pendingCommission, latestStorePaymentDate, storeData } = store;

                      const selectedstore = selected.indexOf(storeData?.storeName) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedstore}>
                          <TableCell align="center">
                            <Link to={`/dashboard/storeProfile/${storeData._id}`}>{serialNumber}</Link>
                          </TableCell>
                      
                    
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${storeData._id}`}>
                            {pendingCommission.toFixed(2)}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${storeData._id}`}>
                            {storeData?.credit.toFixed(2)}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/storeProfile/${storeData._id}`}>
                            {latestStorePaymentDate
                              ? new Date(latestStorePaymentDate).toLocaleDateString('en-GB')
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {!storeState?.storeCommissionLoader &&
                  !isNotFound &&
                  !storeState?.documentCount &&
                  storeState?.storeCommisions?.length === 0 && (
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
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                {isNotFound && storeState?.storeCommisions?.length === 0 && (
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
