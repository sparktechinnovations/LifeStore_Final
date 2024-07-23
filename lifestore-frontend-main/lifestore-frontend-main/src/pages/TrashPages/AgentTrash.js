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
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { Restore } from '@mui/icons-material';
import Iconify from '../../components/iconify';

import Scrollbar from '../../components/scrollbar';
import BreadcrumbsComponent from '../../components/BreadCrumbsComponent';
import { getDeletedAgents, restoreAgents } from '../../features/agentSlice';
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

export default function AgentTrash() {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForRestore, setSelectedForRestore] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const agentState = useSelector((state) => state.agent);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getDeletedAgents({ params: searchParams }));
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

  const isNotFound = !agentState.agents?.length && !!searchParams.get('search');

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
      const newSelecteds = agentState.agents.map((agent) => agent._id);
      setSelected(newSelecteds);
      setSelectedForRestore(newSelecteds);
      return;
    }
    setSelected([]);
    setSelectedForRestore([]);
  };

  const handleRestoreClick = () => {
    dispatch(restoreAgents({ idArray: selectedForRestore.filter((id) => id !== null), params: searchParams }));
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
          <BreadcrumbsComponent lastBreadcrumb="agent" />
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Agnet Trash
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
              placeholder="Search agents.."
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
                  headLabel={TABLE_HEAD}
                  rowCount={agentState.agents?.length}
                  numSelected={selected?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {agentState.getDeletedAgentsLoader ? (
                    <TableRow>
                      <TableCell colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                        <CircularProgress />
                        <Typography textAlign={'center'}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    agentState?.agents?.map((agent, index) => {
                      const { _id, name, phoneNumber, email, createdAt } = agent;
                      const selectedAgent = selected.indexOf(_id) !== -1;

                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedAgent}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedAgent} onChange={(event) => handleClick(event, _id)} />
                          </TableCell>
                          <TableCell align="left">{serialNumber}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{phoneNumber}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{new Date(createdAt).toLocaleDateString('en-GB')}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>

                {!agentState?.getDeletedAgentsLoader && !agentState?.documentCount && !isNotFound && (
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
                            No Agnets found!
                          </Typography>

                     
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!agentState?.getDeletedAgentsLoader && isNotFound && (
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
