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
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { Restore } from '@mui/icons-material';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { getDeletedProducts, restoreProducts } from '../../features/productSlice';
import { UserListHead } from '../../sections/@dashboard/user';

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
  { id: 'sl.No', label: 'Sl.No', alignRight: false },
  { id: 'productName', label: 'Product Name', alignRight: false },
  { id: 'productId', label: 'Product ID', alignRight: false },
  { id: 'productPrice', label: 'Price', alignRight: false },
  { id: 'hsnNumber', label: 'HSN Number', alignRight: false },
  { id: 'customerDiscount', label: 'Customer Discount', alignRight: false },

  { id: 'store.storeName', label: 'Store Name', alignRight: false },
  { id: 'store.storeUid', label: 'Store Uid', alignRight: false },
];


export default function ProductTrash() {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForRestore, setSelectedForRestore] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');

  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getDeletedProducts({ params: searchParams }));
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

  const isNotFound = !productState?.products?.length && !!searchParams.get('search');

  const handleClick = (event, _id) => {
    const selectedIndex = selectedForRestore.indexOf(_id);
    let newSelected = [...selectedForRestore];

    if (selectedIndex === -1) {
      newSelected = [...newSelected, _id];
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedForRestore(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productState?.products.map((product) => product._id);
      setSelected(newSelecteds);
      setSelectedForRestore(newSelecteds)
      return;
    }
    setSelected([]);
    setSelectedForRestore([]);
  };

  const handleShowNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleRestoreClick = () => {
    dispatch(restoreProducts({ idArray: selectedForRestore.filter((id) => id !== null), params: searchParams }))
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
        console.error('Deletion error:', error);
        setSelectedForRestore([]);
        setSelected([]);
      });
  };

  const handleFilterByName = (event) => {
    setSearchTerm(event.target.value);
    searchParams.set('search', event.target.value);
    setSearchParams(searchParams);
  };

  return (
    <>
      <Helmet>
        <title>Trash</title>
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

          <BreadcrumbsComponent lastBreadcrumb="Product" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Trash
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
            {selected?.length > 0 || selectedForRestore?.length > 0 ? (
              <Button
                variant="contained"
                startIcon={<Restore />}
                onClick={handleRestoreClick}
                style={{ backgroundColor: 'black', color: 'white', height: '40px' }}
              >
                Restore
              </Button>
            ) : (
              <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={'end'} width={'100%'}>
                <StyledSearch
                  name="search"
                  value={searchParams.get('search') || ''}
                  onChange={(e) => handleFilterByName(e)}
                  placeholder="Search products.."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  }
                  fullWidth
                />

                <StyledSearch
                  name="store"
                  value={searchParams.get('store') || ''}
                  onChange={(e) => handleFilterByName(e)}
                  placeholder="Search store.."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  }
                  fullWidth
                />
              </Stack>
            )}
          </div>

          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set(
                      'asc',
                      (productState?.order === 'asc' && 'false') || (productState?.order === 'desc' && 'true')
                    );
                    setSearchParams(searchParams);
                  }}
                  order={productState?.order}
                  sortType={productState?.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={productState?.products?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {productState?.getDeletedProductsLoader ? (
                    <TableRow>
                      <TableCell colSpan={10} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    productState?.products.map((product, index) => {
                      const { _id, productName, productId, productPrice, store,hsnNumber,lifestoreDiscount } = product;

                      const selectedProduct = selected.indexOf(_id) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedProduct}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedForRestore.includes(_id)}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell align="center">{serialNumber}</TableCell>
                          <TableCell component="th" scope="row" padding="none" align="center">
                            {productName}
                          </TableCell>
                          <TableCell align="center">{productId}</TableCell>
                          <TableCell align="center">{productPrice}</TableCell>
                          <TableCell align="center">{hsnNumber}</TableCell>
                          <TableCell align="center">{lifestoreDiscount}</TableCell>

                          <TableCell align="center">{store.storeName}</TableCell>
                          <TableCell align="center">{store.storeUid}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>

                {!productState?.getDeletedProductsLoader && !productState?.documentCount && !isNotFound && (
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
                            No Products found!
                          </Typography>

                         
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!productState?.getDeletedProductsLoader && isNotFound && (
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
            count={productState?.documentCount}
            rowsPerPage={productState?.limit}
            page={productState?.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
