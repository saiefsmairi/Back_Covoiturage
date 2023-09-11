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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';



function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);

  const updateStatus = async (requestRideId, status) => {
    try {
      if (status === 'Accepted' && row.availableSeats <= 0) {
        // Display a pop-up or show a message indicating no more seats available
        alert('No more seats available');
        return; // Exit the function without updating the status
      }

      const response = await fetch(`https://localhost:7095/api/RequestRide/requests/${requestRideId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });

      if (response.ok) {
        // Status updated successfully, you can handle the result as needed
        console.log(`Status updated to ${status}`);
        if (status === 'Accepted') {
          setAcceptedRequests([...acceptedRequests, requestRideId]);
        } else if (status === 'Declined') {
          setRejectedRequests([...rejectedRequests, requestRideId]);
        }
        window.location.reload(); 
      } else {
        // Handle error response from the API
        console.error('Error updating status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };



  useEffect(() => {
    if (open) {
      fetch(`https://localhost:7095/api/Trip/trips/${row.tripId}/requests`)
        .then((response) => response.json())
        .then((data) => {
          // Fetch senders' details for each request
          const fetchSendersPromises = data.map((request) =>
            fetch(`https://localhost:7031/api/User/${request.passengerId}`)
              .then((response) => response.json())
              .then((sender) => ({ ...request, sender }))
          );
          Promise.all(fetchSendersPromises)
            .then((requestsData) => setRequests(requestsData))
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  }, [open, row.tripId]);

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
          {row.source}
        </TableCell>
        <TableCell align="right">{row.destination}</TableCell>
        <TableCell align="right">{row.dateDebut.substring(0, 10)}</TableCell>
        <TableCell align="right">{row.dateFin.substring(0, 10)}</TableCell>
        <TableCell align="right">{row.availableSeats}</TableCell>
        <TableCell align="right">{row.distance} km</TableCell>
        <TableCell align="right">
        {row.estimatedTime >= 60 ? `${Math.floor(row.estimatedTime / 60)} hour(s)` : ''} {row.estimatedTime % 60} minute(s)        </TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="right">{row.departureTime.substring(0, 5)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Requests
              </Typography>
              {requests && requests.length > 0 ? (
                <Table size="small" aria-label="requests">
                  <TableHead>
                    <TableRow>
                      <TableCell>Request Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sender First Name</TableCell>
                      <TableCell>Sender Last Name</TableCell>
                      <TableCell>Sender Phone Number</TableCell>
                      <TableCell>Sender Address</TableCell>
                      <TableCell>Sender Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.requestRideId}>
                        <TableCell>{request.requestDate.substring(0, 10)}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>{request.sender.firstName}</TableCell>
                        <TableCell>{request.sender.lastName}</TableCell>
                        <TableCell>{request.sender.phone}</TableCell>
                        <TableCell>{request.sender.adress}</TableCell>
                        <TableCell>{request.sender.email}</TableCell>
                        <TableCell align="right">
                          {request.status === 'Canceled' ? (
                            <ClearIcon color="#808080" />
                          ) : (
                            request.status !== 'Pending' && (
                              <DoneIcon color={request.status === 'Accepted' ? 'success' : 'error'} />
                            )
                          )}
                          {request.status === 'Pending' && (
                            <>
                              <IconButton
                                aria-label="accept"
                                size="small"
                                color="primary"
                                onClick={() => updateStatus(request.requestRideId, 'Accepted')}
                                disabled={acceptedRequests.includes(request.requestRideId) || rejectedRequests.includes(request.requestRideId)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton
                                aria-label="reject"
                                size="small"
                                color="secondary"
                                onClick={() => updateStatus(request.requestRideId, 'Declined')}
                                disabled={acceptedRequests.includes(request.requestRideId) || rejectedRequests.includes(request.requestRideId)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No requests found.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    source: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    dateDebut: PropTypes.string,
    dateFin: PropTypes.string,
    availableSeats: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    estimatedTime: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    departureTime: PropTypes.string.isRequired,
    tripId: PropTypes.number.isRequired,
  }).isRequired,
};

export default function CollapsibleTable() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`https://localhost:7095/api/Trip/user/${userId}/trips`)
      .then((response) => response.json())
      .then((data) => setTrips(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Source</TableCell>
            <TableCell align="right">Destination</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Available Seats</TableCell>
            <TableCell align="right">Distance</TableCell>
            <TableCell align="right">Estimated Time</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No trips found.
              </TableCell>
            </TableRow>
          ) : (
            trips.map((trip) => <Row key={trip.tripId} row={trip} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
