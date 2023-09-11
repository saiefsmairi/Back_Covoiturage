import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Row(props) {
  const { row, deleteRequest } = props;
  const [open, setOpen] = useState(false);

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
          {row.requestDate.substring(0, 10)}
        </TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">{row.source}</TableCell>
        <TableCell align="right">{row.destination}</TableCell>
        <TableCell align="right">{row.availableSeats}</TableCell>
        <TableCell align="right">{row.dateDebut.substring(0, 10)}</TableCell>
        <TableCell align="right">{row.dateFin.substring(0, 10)}</TableCell>
        <TableCell align="right">{row.time.substring(0, 5)}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="cancel"
            size="small"
            color="error"
            onClick={() => deleteRequest(row.requestId, row.status)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Driver Info
              </Typography>
              <Table size="small" aria-label="driver-info">
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.driver.firstName}</TableCell>
                    <TableCell>{row.driver.lastName}</TableCell>
                    <TableCell>{row.driver.phone}</TableCell>
                    <TableCell>{row.driver.adress}</TableCell>
                    <TableCell>{row.driver.email}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    requestDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    availableSeats: PropTypes.number.isRequired,
    dateDebut: PropTypes.string.isRequired,
    dateFin: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    driver: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      adress: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    requestId: PropTypes.number.isRequired,
  }).isRequired,
  deleteRequest: PropTypes.func.isRequired,
};

export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      fetch(`https://localhost:7095/api/RequestRide/passenger/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          const updatedRows = data.map((request) => ({
            requestDate: request.requestDate,
            status: request.status,
            source: '',
            destination: '',
            availableSeats: 0,
            dateDebut: '',
            dateFin: '',
            time: '',
            driver: {
              firstName: '',
              lastName: '',
              phone: '',
              adress: '',
              email: '',
            },
            requestId: request.requestRideId,
            tripId: request.tripId,
            driverId: request.driverId,
          }));

          setRows(updatedRows);

          // Fetch additional trip and driver information for each request
          Promise.all(
            data.map((request) =>
              fetch(`https://localhost:7095/api/Trip/${request.tripId}`)
                .then((response) => response.json())
                .then((tripData) => {
                  const updatedRow = updatedRows.find(
                    (row) => row.tripId === request.tripId
                  );

                  if (updatedRow) {
                    updatedRow.source = tripData.source;
                    updatedRow.destination = tripData.destination;
                    updatedRow.availableSeats = tripData.availableSeats;
                    updatedRow.dateDebut = tripData.dateDebut;
                    updatedRow.dateFin = tripData.dateFin;
                    updatedRow.time = tripData.departureTime;
                  }

                  return fetch(`https://localhost:7031/api/User/${request.driverId}`);
                })
                .then((response) => response.json())
                .then((driverData) => {
                  const updatedRow = updatedRows.find(
                    (row) => row.driverId === request.driverId
                  );

                  if (updatedRow) {
                    updatedRow.driver = {
                      firstName: driverData.firstName,
                      lastName: driverData.lastName,
                      phone: driverData.phone,
                      adress: driverData.adress,
                      email: driverData.email,
                    };
                  }
                })
            )
          ).then(() => setRows(updatedRows));
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const deleteRequest = (requestId, status) => {
    console.log('deleteRequest called with requestId:', requestId);
    console.log('deleteRequest called with status:', status);

    if (status === 'Accepted') {
      confirmAlert({
        title: 'Confirm cancel',
        message: 'Are you sure you want to cancel an Accepted Request?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              const statusUpdate = 'Canceled';
              try {
                const response = await fetch(`https://localhost:7095/api/RequestRide/requests/${requestId}/status`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(statusUpdate),
                });

                if (response.ok) {
                  console.log('Request id: ', requestId)
                  console.log('Request canceled successfully');
                  // Remove the request from the table
                  setRows((prevRows) => prevRows.filter((row) => row.requestId !== requestId));
                } else {
                  console.error('Error canceling request:', response.status);
                }
              } catch (error) {
                console.error('Error canceling request:', error);
              }
            },
          },
          {
            label: 'No',
          },
        ],
      });
    } else {
      // Request is not Accepted, so it can be directly deleted
      confirmAlert({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this request?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              const statusUpdate = 'Deleted';
              try {
                const response = await fetch(`https://localhost:7095/api/RequestRide/requests/${requestId}/status`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(statusUpdate),
                });

                if (response.ok) {
                  console.log('Request id: ', requestId)

                  console.log('Request deleted successfully');
                  // Remove the request from the table
                  setRows((prevRows) => prevRows.filter((row) => row.requestId !== requestId));
                } else {
                  console.error('Error deleting request:', response.status);
                }
              } catch (error) {
                console.error('Error deleting request:', error);
              }
            },
          },
          {
            label: 'No',
          },
        ],
      });
    }
  };

  const filteredRows = rows.filter((row) => row.status !== 'Canceled');

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Date</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Source</TableCell>
            <TableCell align="right">Destination</TableCell>
            <TableCell align="right">Seats</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row) => (
            <Row key={row.requestId} row={row} deleteRequest={deleteRequest} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
