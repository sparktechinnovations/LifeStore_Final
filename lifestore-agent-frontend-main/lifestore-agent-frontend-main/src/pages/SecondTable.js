import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, CircularProgress, Container, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import {  getAgentCommission, } from '../features/agentSlice';

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
  const authState = useSelector(state => state.auth);
  const id = authState.user?._id;

  useEffect(() => {

    dispatch(getAgentCommission({id}));
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
                   agentState?.dateList?.map((agentData, index) => {
                      const { _id, commissions, storePending, pendingCommission } = agentData;


                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} style={{ margincenter: '10px' }}>
                        <TableCell align="center">{serialNumber}</TableCell>
                        <TableCell align="center">{new Date(_id).toLocaleDateString('en-GB')}</TableCell>
                        <TableCell align="center">{commissions.toFixed(2)}</TableCell>
                        <TableCell align="center">{storePending.toFixed(2)}</TableCell>
                        <TableCell align="center">{pendingCommission.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          {pendingCommission === 0
                            ? 'Paid'
                            : storePending
                            ? 'waithing for store payment'
                            : 'Not Paid'}
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
