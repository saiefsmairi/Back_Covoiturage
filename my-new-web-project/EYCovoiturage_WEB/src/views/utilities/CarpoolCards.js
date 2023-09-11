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
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneIcon from '@mui/icons-material/Done';


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
  justifyContent:'space-between'
});

const CarpoolCard = styled(Card)({
  width: 'calc(25% - 20px)', // Adjust the width as per your requirement
  maxWidth: '520px',
  height:'fit-content'
});

export default function CarpoolCards() {
  const [carpools, setCarpools] = useState([]);
  const [filteredCarpools, setFilteredCarpools] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const passengerId = localStorage.getItem('userId');
  const [users, setUsers] = useState({});
  const [requestStatus, setRequestStatus] = useState({});
  const [index,setIndex] = useState(null)

  const handleExpandClick = (idx) => {
    setIndex(idx)
    setExpanded(!expanded)
  };
 console.log(index)
  const fetchCarpools = async () => {
    try {
      const response = await axios.get('https://localhost:7095/api/Trip/all');
      const filtered = response.data.filter(carpool => carpool.availableSeats > 0);
      setCarpools(response.data);
      setFilteredCarpools(filtered);
      // Fetch request status for each carpool
      const passengerId = parseInt(localStorage.getItem('userId'));
      filtered.forEach(carpool => {
        checkRequestStatus(carpool.tripId, passengerId);
      });
    } catch (error) {
      console.error('Error fetching carpools:', error);
    }
  };

  useEffect(() => {
    fetchCarpools();
  }, []);

  useEffect(() => {
    const filtered = carpools.filter(carpool => carpool.availableSeats > 0);
    setFilteredCarpools(filtered);
  }, [carpools]);

  const checkRequestStatus = async (tripId, passengerId) => {
    try {
      const response = await axios.get(`https://localhost:7095/api/Trip/${tripId}/users/${passengerId}/check-request`);
      const status = response.data;
      setRequestStatus(prevStatus => ({ ...prevStatus, [tripId]: status }));
    } catch (error) {
      console.error('Error checking request status:', error);
    }
  };

  const handleSendRequest = (tripId, userId) => {
    const passengerId = parseInt(localStorage.getItem('userId'));

    if (passengerId === userId) {
      alert("You can't send a request to your own Carpool");
      return; // Don't send the request or call the API
    }

    const requestData = {
      requestDate: new Date().toISOString(),
      status: 'Pending',
      passengerId: passengerId,
      driverId: userId,
    };

    console.log('Sending request:', requestData);

    axios
      .post(`https://localhost:7095/api/Trip/${tripId}/request-rides`, requestData)
      .then(response => {
        console.log('Request sent successfully:', response.data);
        window.location.reload(); 

      })
      .catch(error => {
        console.error('Error sending request:', error);
        console.log('Error Response: ', error.response.data)
      });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userIds = filteredCarpools.map(carpool => carpool.userId);
        const requests = userIds.map(userId =>
          axios.get(`https://localhost:7031/api/User/${userId}`)
        );
        const responses = await Promise.all(requests);
        const usersData = responses.reduce((data, response, index) => {
          const { firstName, lastName, phone, email } = response.data;
          const userId = userIds[index];
          data[userId] = { firstName, lastName, phone, email };
          return data;
        }, {});
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [filteredCarpools]);

  return (
    <CarpoolCardsContainer>
      {filteredCarpools.map((carpool,idx) => (
        <CarpoolCard key={carpool.tripId}>
          <CardHeader
          sx={{padding:'8px 20px'}}
            avatar={
              <Avatar src="https://cdn-icons-png.flaticon.com/512/149/149071.png" aria-label="recipe">
                EY
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={carpool.title}
            subheader={
              <div>
                <Typography variant="body2">
                  {users[carpool.userId] && (
                    <>
                      <strong>
                        {users[carpool.userId].firstName} {users[carpool.userId].lastName}
                      </strong>
                      <br />
                      {users[carpool.userId].phone}
                      <br />
                      {users[carpool.userId].email}
                    </>
                  )}
                </Typography>
              </div>
            }
          />
          <CardMedia
            component="img"
            height="194"
            image="https://thumbs.dreamstime.com/b/illustration-de-service-carpool-le-chef-heureux-crabots-mignons-effront%C3%A9s-personnage-dessin-anim%C3%A9-fond-isol%C3%A9-blanc-sourire-144520217.jpg"
            alt="Carpool"
          />
          <CardContent sx={{padding:'8px 20px'}}>
            <Typography variant="h5" component="h6">
              <strong>Plan:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Source:</strong> <span title={carpool.source} style={{cursor:'alias'}}>{carpool.source.substring(0, 40)}...</span> <br />
              <strong>Destination:</strong> <span title={carpool.destination} style={{cursor:'alias'}}>{carpool.destination.substring(0, 40)}...</span> <br />
              <strong>Start date:</strong> {carpool.dateDebut.substring(0, 10)}<br />
              <strong>End date:</strong> {carpool.dateFin.substring(0, 10)}<br />
              <strong>Departure time:</strong> {carpool.departureTime.substring(0, 5)}<br />
              <Typography variant="h5" component="h6" sx={{mt:2}}>
                <strong> Details:</strong>
              </Typography>
              <strong>Available Seats:</strong> {carpool.availableSeats}<br />
              <strong>Distance:</strong> {carpool.distance} km<br />
              <strong>Estimated time:</strong> {carpool.estimatedTime >= 60 ? `${Math.floor(carpool.estimatedTime / 60)} hour(s)` : ''} {carpool.estimatedTime % 60} minute(s) <br />
              <strong>Type:</strong> {carpool.type}<br />
            </Typography>
              <div style={{
                display:'flex',
                alignItems:'center',
                gap:5,
                marginTop:'20px'
              }}>

              <Typography variant="h5" component="h6">
                <strong> Preferences:</strong>
              </Typography>
              <strong>Smoke:</strong> {carpool.smoke ? "Yes" : "No"}<br />
              <strong>Food:</strong> {carpool.food ? "Yes" : "No"}<br />
              <strong>Music:</strong> {carpool.music ? "Yes" : "No"}<br />
              </div>
          </CardContent>
          <CardActions disableSpacing sx={{padding:'2px 20px'}}>
            <Typography variant="body2" color="text.secondary">
              <strong>{requestStatus[carpool.tripId] ? 'Request Sent' : 'Send Request'}</strong>
            </Typography>
            {requestStatus[carpool.tripId] ? (
              <DoneIcon sx={{ color: 'success' }} />
            ) : (
              <IconButton
                aria-label="send request"
                onClick={() => handleSendRequest(carpool.tripId, carpool.userId)}
              >
                <SendIcon />
              </IconButton>
            )}
            <ExpandMore
              onClick={()=>handleExpandClick(idx)}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>

          <Collapse in={idx == index && expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph variant="h5" component="h6"> <strong> Description: </strong></Typography>
              <Typography paragraph>{carpool.description}</Typography>
            </CardContent>
          </Collapse>
        </CarpoolCard>
      ))}
    </CarpoolCardsContainer>
  );
}
