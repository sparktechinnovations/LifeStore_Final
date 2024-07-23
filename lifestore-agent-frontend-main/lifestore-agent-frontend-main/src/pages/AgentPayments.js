/* eslint-disable import/no-unresolved */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  useTheme,
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

import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { getAgentPayments } from '../features/agentSlice';

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

  { id: 'amount', label: 'Amount', align: 'center' },
  { id: 'date', label: 'Paid On', align: 'center' },
  { id: 'invoiceFrom', label: 'Invoice Date From', align: 'center' },
  { id: 'invoiceTo', label: 'Invoice Date To', align: 'center' },
];

export default function AgentPayments() {
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAgentPayments({ params: searchParams }));
  }, [searchParams, dispatch]);

  const agentState = useSelector((state) => state.agent);

  const handleChangePage = (e, newPage) => {
    searchParams.set('page', newPage + 1);
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (e) => {
    searchParams.delete('page');
    searchParams.set('limit', e.target.value);
    setSearchParams(searchParams);
  };

  const handleReset = () => {
    setSearchParams('');
  };

  const isNotFound = !agentState.payments?.length && !!searchParams.get('search') && agentState.agentPaymentsSuccess;

  return (
    <>
      <Helmet>
        <title>Agent Payments </title>
      </Helmet>

      <Container>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <BreadcrumbsComponent lastBreadcrumb="Agent Payments" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Agent Payments
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
            <Stack justifyContent="center" display={'flex'} alignItems={'center'} mt={3} width={'100%'}>
              <Button onClick={handleReset} variant="outlined" sx={{ width: '100%', maxWidth: '10rem' }}>
                Reset
              </Button>
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
                      (agentState.order === 'asc' && 'false') || (agentState.order === 'desc' && 'true')
                    );
                    setSearchParams(searchParams);
                  }}
                  order={agentState.order}
                  sortType={agentState.sortType}
                  checkbox={false}
                  headLabel={TABLE_HEAD}
                  rowCount={agentState.payments?.length}
                  numSelected={selected?.length}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {agentState?.getAgentPaymentsLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : agentState?.getAgentPaymentsError ? (
                    <>
                      <Alert severity="error">Agent Payments fetching error</Alert>
                    </>
                  ) : (
                    agentState?.payments?.map((agents, index) => {
                      const { _id, amount, date, agent, invoiceFrom, invoiceTo } = agents;

                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          <TableCell align="center">{serialNumber}</TableCell>

                          <TableCell align="center">{amount.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            {date ? new Date(date).toLocaleDateString('en-GB') : 'N/A'}
                          </TableCell>
                          <TableCell align="center">{new Date(invoiceFrom).toLocaleDateString('en-GB')}</TableCell>
                          <TableCell align="center">{new Date(invoiceTo).toLocaleDateString('en-GB')}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>

                {!agentState?.getAgentPaymentsLoader && !agentState?.documentCount && !isNotFound && (
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

                {!agentState?.getAgentPaymentsLoader && isNotFound && (
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
            count={agentState.documentCount}
            rowsPerPage={agentState.limit}
            page={agentState.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
