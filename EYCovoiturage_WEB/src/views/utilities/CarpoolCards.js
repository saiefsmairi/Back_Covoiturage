import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CarpoolCardsContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
});

const CarpoolCard = styled(Card)({
  width: 'calc(25% - 20px)', // Adjust the width as per your requirement
  maxWidth: '345px',
});

export default function CarpoolCards() {
  const [carpools, setCarpools] = useState([]);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchCarpools = async () => {
      try {
        const response = await axios.get('https://localhost:7095/api/Trip'); // Replace with your backend API endpoint
        setCarpools(response.data); // Assuming the response data is an array of carpools  
      } catch (error) {
        console.error('Error fetching carpools:', error);
      }
    };

    fetchCarpools();
  }, []);

  const handleSendRequest = (tripId, userId) => {
    const requestData = {
      requestRideId: 0,
      requestDate: new Date().toISOString(),
      status: "Pending",
      tripId: tripId,
      passengerId: 4,
      driverId: userId,
    };
  
    console.log("Sending request:", requestData);
  
    // Send the request to the backend
    axios.post("https://localhost:7095/api/RequestRide", requestData)
      .then(response => {
        // Handle the response
        console.log("Request sent successfully:", response.data);
      })
      .catch(error => {
        // Handle errors
        console.error("Error sending request:", error);
      });
  };
  return (
    <CarpoolCardsContainer>
      {carpools.map((carpool) => (
        <CarpoolCard key={carpool.tripId}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                EY
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={carpool.title}
            subheader={`Start date: ${carpool.dateDebut} - End date: ${carpool.dateFin}`}
          />
          <CardMedia
            component="img"
            height="194"
            image={carpool.image}
            alt="Carpool"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Details: <br />
              Source: {carpool.source}<br />
              Destination: {carpool.destination}<br />
              Available Seats: {carpool.availableSeats}<br />
              Distance: {carpool.distance}<br />
              Estimated time: {carpool.estimatedTime}<br />
              Departure time: {carpool.departureTime}<br />
              Type: {carpool.type}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="send request" onClick={() => handleSendRequest(carpool.tripId, carpool.userId)}>
              <SendIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>{carpool.description}</Typography>
            </CardContent>
          </Collapse>
        </CarpoolCard>
      ))}
    </CarpoolCardsContainer>
  );
}
