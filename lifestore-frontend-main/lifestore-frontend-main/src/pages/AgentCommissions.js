/* eslint-disable import/no-unresolved */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Paper,
  Grid,
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
  Button,
  CircularProgress,
} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import AppWidgetSummary from '../sections/@dashboard/app/AppWidgetSummary';
import BreadcrumbsComponent from '../components/BreadCrumbsComponent';
import { agentCommissionList } from '../features/agentSlice';

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
  { id: 'agentInfo.name', label: ' Name', align: 'center' },
  { id: 'agentInfo.agentUid', label: 'Agent ID', align: 'center' },
  { id: 'pendingCommission', label: 'Commission Pending', align: 'center' },
  { id: 'paidCommission', label: 'Commission Paid', align: 'center' },
  { id: 'latestagentPaymentDate', label: 'Last Paid On', align: 'center' },
];

export default function AgentCommissions() {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const navigate = useNavigate();
  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(agentCommissionList({ params: searchParams }));
  }, [searchParams, dispatch]);

  const agentState = useSelector((state) => state.agent);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = agentState?.agents.map((agent) => agent._id);
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

  const isNotFound = !agentState?.agents?.length && !!searchTerm && agentState?.agentListSuccess;



  return (
    <>
      <Helmet>
        <title>agents </title>
      </Helmet>

      <Container>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <BreadcrumbsComponent lastBreadcrumb="agent Commission" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            agent Commissions
          </Typography>
        </Stack>

        <Grid container spacing={3} mb={2} justifyContent={'center'}>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Paid Commissions" total={(+agentState?.totalCommissions?.paidCommission || 0).toFixed(2)} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Pending Commissions" total={(+agentState?.totalCommissions?.pendingCommission || 0).toFixed(2)} color="info" />
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
                  placeholder="Search Agents..."
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
                <InputLabel htmlFor="fromDate">To</InputLabel>
                <TextField
                  fullWidth
                  name="fromDate"
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
                checkbox={false}
                  onRequestSort={(e) => {
                    searchParams.set('sortType', e);
                    searchParams.set(
                      'asc',
                      (agentState?.order === 'asc' && 'false') || (agentState?.order === 'desc' && 'true')
                    );
                    searchParams.delete('page');
                    setSearchParams(searchParams);
                  }}
                  order={agentState?.order}
                  sortType={agentState?.sortType}
                  headLabel={TABLE_HEAD}
                  rowCount={agentState?.agents?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {agentState?.getAgentLoader ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        Loading...
                      </td>
                    </tr>
                  ) : agentState?.agentListError ? (
                    <>
                      <Alert severity="error">{agentState?.agentListError}</Alert>
                    </>
                  ) : (
                    agentState?.agentCommissions?.map((agent, index) => {
                      const { _id, pendingCommission, paidCommission, latestAgentPaymentDate, agentInfo } = agent;

                      const selectedagent = selected.indexOf(agentInfo?.name) !== -1;
                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedagent}>
                         
                          <TableCell align="center" component={Link} to={`/dashboard/agentProfile/${agentInfo._id}`}>
                            {serialNumber}
                          </TableCell>
                          <TableCell
                            scope="row"
                            padding="none"
                            component={Link}
                            to={`/dashboard/agentProfile/${agentInfo._id}`}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {agentInfo?.name}
                                {agentInfo?.deleteStatus === 'true' && '(Deleted)'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/agentProfile/${agentInfo._id}`}>
                            {agentInfo.agentUid}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/agentProfile/${agentInfo._id}`}>
                            {pendingCommission.toFixed(2)}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/agentProfile/${agentInfo._id}`}>
                            {paidCommission.toFixed(2)}
                          </TableCell>
                          <TableCell align="center" component={Link} to={`/dashboard/agentProfile/${agentInfo._id}`}>
                            {latestAgentPaymentDate
                              ? new Date(latestAgentPaymentDate).toLocaleDateString('en-GB')
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {!agentState?.agentCommissionLoader && !isNotFound && !agentState?.documentCount && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No agents found!
                          </Typography>

                          <Typography variant="body2">Add agents to see agent List</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {isNotFound && agentState?.agents?.length === 0 && (
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
            count={agentState?.documentCount}
            rowsPerPage={agentState?.limit}
            page={agentState?.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
