import React, { useState } from 'react';
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
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function Row(props) {
  const { row } = props;
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
          {row.source}
        </TableCell>
        <TableCell align="right">{row.destination}</TableCell>
        <TableCell align="right">{row.startDate}</TableCell>
        <TableCell align="right">{row.endDate}</TableCell>
        <TableCell align="right">{row.availableSeats}</TableCell>
        <TableCell align="right">{row.distance}</TableCell>
        <TableCell align="right">{row.estimatedTime}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="right"> {/* New column for Actions */}
          <IconButton
            aria-label="update"
            size="small"
            color="primary"
            onClick={() => {
              // Handle update button click
            }}
          >
            <UpdateIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            color="secondary"
            onClick={() => {
              // Handle delete button click
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}> {/* Update the colSpan value */}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Requests
              </Typography>
              <Table size="small" aria-label="requests">
                <TableHead>
                  <TableRow>
                    <TableCell>Request Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Pickup Point</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>{request.pickupPoint}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="accept"
                          size="small"
                          color="primary"
                          onClick={() => {
                            // Handle accept button click
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          aria-label="reject"
                          size="small"
                          color="secondary"
                          onClick={() => {
                            // Handle reject button click
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [rows, setRows] = useState([
    {
      id: 1,
      source: 'Source 1',
      destination: 'Destination 1',
      startDate: '2023-05-17',
      endDate: '2023-05-18',
      availableSeats: 3,
      distance: 10,
      estimatedTime: '2 hours',
      type: 'Type 1',
      requests: [
        {
          id: 1,
          requestDate: '2023-05-17',
          status: 'Pending',
          pickupPoint: 'Pickup Point 1',
        },
        // Add more request objects as needed
      ],
    },
    // Add more rows as needed
  ]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Source</TableCell>
            <TableCell align="right">Destination</TableCell>
            <TableCell align="right">Start Date and Time</TableCell>
            <TableCell align="right">End Date and Time</TableCell>
            <TableCell align="right">Available Seats</TableCell>
            <TableCell align="right">Distance</TableCell>
            <TableCell align="right">Estimated Time</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Actions</TableCell> {/* Updated column header */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
