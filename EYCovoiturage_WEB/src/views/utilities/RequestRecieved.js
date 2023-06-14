import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [passengerData, setPassengerData] = useState(null);

  const updateStatus = async (status) => {
    try {
      const response = await fetch(`https://localhost:7095/api/RequestRide/requests/${row.requestRideId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });

      if (response.ok) {
        // Status updated successfully, you can handle the result as needed
        console.log(`Status updated to ${status}`);
      } else {
        // Handle error response from the API
        console.error('Error updating status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    const fetchPassengerData = async () => {
      try {
        const response = await fetch(`https://localhost:7031/api/User/${row.passengerId}`);
        const data = await response.json();
        setPassengerData(data);
      } catch (error) {
        console.error('Error fetching passenger data:', error);
      }
    };

    if (open) {
      fetchPassengerData();
    }
  }, [open, row.passengerId]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.requestDate}
        </TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">{row.source}</TableCell>
        <TableCell align="right">{row.destination}</TableCell>
        <TableCell align="right"> {/* New column for Actions */}
          <IconButton
            aria-label="accept"
            size="small"
            color="primary"
            onClick={() => updateStatus('Accepted')}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            aria-label="reject"
            size="small"
            color="secondary"
            onClick={() => updateStatus('Declined')}
          >
            <CancelIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Associated Passenger
              </Typography>
              <Table size="small" aria-label="requests">
                <TableHead>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>Phone number</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>EY mail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {passengerData && (
                    <TableRow>
                      <TableCell>{passengerData.firstName}</TableCell>
                      <TableCell>{passengerData.lastName}</TableCell>
                      <TableCell>{passengerData.phone}</TableCell>
                      <TableCell>{passengerData.adress}</TableCell>
                      <TableCell>{passengerData.email}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function RequestReceived() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch('https://localhost:7095/api/RequestRide/requests/1');
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    };

    fetchRequestData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Request Date</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Source</TableCell>
            <TableCell align="right">Destination</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.requestRideId} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
