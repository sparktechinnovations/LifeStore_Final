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
  CircularProgress,
  Box,

} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { productList, deleteProducts } from '../features/productSlice';


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
  { id: 'customerDiscount', label: 'Customer Discount', alignRight: false },
  { id: 'hsnNumber', label: 'HSN Number', alignRight: false },

  { id: 'store.storeName', label: 'Store Name', alignRight: false },
  { id: 'store.storeUid', label: 'Store Uid', alignRight: false },
];

export default function ProductPage() {
  
  const [selected, setSelected] = useState([]);
  const [store, setstore] = useState(null)
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

  const productState = useSelector((state) => state.product);



  useEffect(() => {
    dispatch(productList({ params: searchParams }));

  }, [dispatch, searchParams]);



  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productState?.products.map((product) => product._id);
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

  const handleDeleteConfirmation = () => {
    dispatch(deleteProducts({ idArray: selectedForDeletion.filter((id) => id !== null) }))
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


  const handleFilterByName = (event) => {
    setSearchTerm(event.target.value);
    searchParams.set(event.target.name, event.target.value);
    searchParams.delete('page');
    setSearchParams(searchParams);
  };


  const isNotFound = !productState?.products?.length && !!searchParams.get('search');

  return (
    <>
      <Helmet>
        <title>Product </title>
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
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={Link}
            to="/dashboard/newProduct"
            style={{ backgroundColor: 'black' }}
          >
            New product
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
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set(
                      'asc',
                      (productState?.order === 'asc' && 'false') || (productState?.order === 'desc' && 'true')
                    );
                    searchParams.delete('page');
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
                  {productState?.productListLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
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
                              checked={selectedForDeletion.includes(_id)}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {serialNumber}
                          </TableCell>
                          <TableCell
                            scope="row"
                            padding="none"
                            align="center"
                            component={Link} to={`/dashboard/productProfile/${_id}`}
                          >
                            {productName}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {productId}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {productPrice}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {lifestoreDiscount}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {hsnNumber}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {store.storeName}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/productProfile/${_id}`}>
                            {store.storeUid}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {!productState?.productListLoader && !productState?.documentCount && !isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No products found!
                          </Typography>

                          <Typography variant="body2">Add products to see product List</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!productState?.productListLoader && isNotFound && (
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
