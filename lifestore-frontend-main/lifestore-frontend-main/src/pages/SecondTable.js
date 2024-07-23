import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, CircularProgress, Container, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import { agentCommissionList } from '../features/agentSlice';

// Import other components and data as needed

const TABLE_HEAD = [
  { id: 'sl.no', label: 'Sl.No', align: 'center' },
  { id: 'agentInfo.name', label: ' Name', align: 'center' },
  { id: 'agentInfo.agentUid', label: 'Agent ID', align: 'center' },
  { id: 'pendingCommission', label: 'Commission Pending', align: 'center' },
  { id: 'paidCommission', label: 'Commission Paid', align: 'center' },
  { id: 'latestagentPaymentDate', label: 'Last Paid On', align: 'center' },
];
export default function SecondTable() {
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {


    dispatch(agentCommissionList({ params: '' }));
  }, [dispatch]);

  const agentState = useSelector((state) => state.agent);
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

  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom>
          Agent Commissions
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/dashboard/agentCommission">
              View More...
            </Button>
          </div>
        </Typography>
        <Card>
          <TableContainer component={Paper}>
            <Scrollbar>
              <Table>
                <UserListHead checkbox={false} headLabel={TABLE_HEAD} rowCount={agentState?.agents?.length} />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {agentState?.getagentLoader ? (
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
                          <TableCell align="center">{serialNumber}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {agentInfo?.name}
                                {agentInfo?.deleteStatus === 'true' && '(Deleted)'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{agentInfo.agentUid}</TableCell>
                          <TableCell align="center">{pendingCommission?.toFixed(2) || 0.0}</TableCell>
                          <TableCell align="center">{paidCommission?.toFixed(2) || 0.0}</TableCell>
                          <TableCell align="center">
                            {latestAgentPaymentDate
                              ? new Date(latestAgentPaymentDate).toLocaleDateString('en-GB')
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
        <br />
      </Container>
    </>
  );
}
