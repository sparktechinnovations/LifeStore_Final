import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, CircularProgress, Container, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Scrollbar from '../components/scrollbar';
import { storeCommissionList } from '../features/storeSlice';
import { UserListHead } from '../sections/@dashboard/user';

// Import other components and data as needed

const TABLE_HEAD = [
  { id: '', label: 'Sl.No', alignRight: false },
  { id: 'name', label: 'Store Name', align: 'center' },
  { id: 'id', label: 'Store ID', align: 'center' },
  { id: 'commission', label: 'Commission To Be Recieved', align: 'center' },
  { id: 'credits', label: 'Credits', align: 'center' },
  { id: 'createdAt', label: 'Last Recieved On', align: 'center' },
];

export default function FirstTable() {
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(storeCommissionList({ params: '' }));
  }, [dispatch]);

  const storeState = useSelector((state) => state.store);

  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom>
          Store Commissions
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/dashboard/storeCommission">
              View More...
            </Button>
          </div>
        </Typography>

        <Card>
          <TableContainer component={Paper}>
            <Scrollbar>
              <Table>
                <UserListHead checkbox={false} headLabel={TABLE_HEAD} rowCount={storeState.stores?.length} />
                <TableBody style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                  {storeState.getStoreLoader ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
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

                      const serialNumber = index + 1;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          <TableCell align="center">{serialNumber}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {storeData?.storeName}
                                {storeData?.deleteStatus === 'true' && '(Deleted)'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{storeData?.storeUid}</TableCell>
                          <TableCell align="center">{pendingCommission?.toFixed(2) || 0.0}</TableCell>
                          <TableCell align="center">{storeData?.credit?.toFixed(2) || 0.0}</TableCell>
                          <TableCell align="center">
                            {latestStorePaymentDate
                              ? new Date(latestStorePaymentDate).toLocaleDateString('en-GB')
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
