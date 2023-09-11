import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Stepper from '@mui/material/Stepper';
import StepButton from '@mui/material/StepButton';
import Stack from '@mui/material/Stack';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from "leaflet";
import DatePicker from "react-multi-date-picker";
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Typography from '@mui/material/Typography';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import foodIcon from './../../icons/foodIcon.png';
import musicIcon from './../../icons/musicIcon.png';
import smokeIcon from './../../icons/smokeIcon.png';
import noFoodIcon from './../../icons/noFoodIcon.png';
import noMusicIcon from './../../icons/noMusicIcon.png';
import noSmokeIcon from './../../icons/noSmokeIcon.png';
import { Grid } from '@mui/material';






const steps = ['Select campaign settings', 'Create an ad'];

export default function NewCarpoolForm() {

  const [source, setSource] = useState('');
  const [sourceLng, setSourceLng] = useState('');
  const [sourceLat, setSourceLat] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationLng, setDestinationLng] = useState('');
  const [destinationLat, setDestinationLat] = useState('');
  const [seats, setSeats] = useState(1);
  const [distance, setDistance] = useState('');
  const [estimatedTime, setTime] = useState('');
  const [type, setType] = useState('');
  const [availableDates, setAvailableDates] = useState([new Date()]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [departureTimeInput, setDepartureTimeInput] = useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [food, setFood] = useState(true);
  const [smoke, setSmoke] = useState(true);
  const [music, setMusic] = useState(true);
  const [description, setDescription] = useState('');

  const userId = localStorage.getItem('userId');

  // handle type and date

  useEffect(() => {
    setType(availableDates.length === 1 ? 'occasionnel' : 'regular');
  }, [availableDates]);

  const handleDateChange = (dates) => {
    setAvailableDates(dates);
  };



  // description

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };


  // food, music and smoke buttons

  const handleFoodClick = () => {
    const newFood = !food;
    setFood(newFood);
    console.log("food: ", newFood)
  };

  const handleSmokeClick = () => {
    const newSmoke = !smoke;
    setSmoke(newSmoke);
    console.log("smoke: ", newSmoke)
  };

  const handleMusicClick = () => {
    const newMusic = !music;
    setMusic(newMusic);
    console.log("music: ", newMusic)
  };

  // Step bar 

  const handleNext = (e) => {
    e.preventDefault();

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Availables seats

  const handleSeatDecrement = () => {
    if (seats > 1) {
      setSeats(seats - 1);
    }
  };

  const handleSeatIncrement = () => {
    if (seats < 6) {
      setSeats(seats + 1);
    }
  };

  // Departure time

  const handleTimeChange = (time) => {
    let selectedTime = dayjs(time).format('HH:mm');
    if (selectedTime.includes('PM')) {
      const [hours, minutes] = selectedTime.split(':');
      const convertedHours = parseInt(hours, 10) + 12;
      selectedTime = `${convertedHours}:${minutes}`;
    }
    setDepartureTimeInput(selectedTime);
    console.log('Selected time:', selectedTime);
  };
  

  // MAP Locations

  const handleLocationSelect = (selectedLocation, inputField) => {
    const locationLabel = selectedLocation.properties.formatted;
    const latitude = selectedLocation.geometry.coordinates[1];
    const longitude = selectedLocation.geometry.coordinates[0];

    setSelectedLocation(selectedLocation.geometry.coordinates)

    console.log("Selected Location:", locationLabel);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    if (inputField === 'source') {
      setSource(locationLabel);
      setSourceLng(longitude);
      setSourceLat(latitude);
    } else if (inputField === 'destination') {
      setDestination(locationLabel);
      setDestinationLng(longitude);
      setDestinationLat(latitude);
    }

    setSelectedLocation(selectedLocation.geometry.coordinates);
  };

  const handleSearchQueryChange = async (query) => {
    setSearchQuery(query);
    console.log(query)
    if (!query) {
      setAutocompleteResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&filter=countrycode:tn&apiKey=417ac2d0c2184f818d900b97d70d4ad6`
      );
      console.log(response.data.features);
      const data = response.data.features;
      setAutocompleteResults(data);
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
      setAutocompleteResults([]);
    }
  };

  // Map distance, estimated time and route

  const fetchRoute = async () => {
    try {
      const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${sourceLat},${sourceLng}|${destinationLat},${destinationLng}&mode=drive&apiKey=fad74474846544cfa2e35a5f60a3b11e`;

      axios.get(apiUrl)
        .then(response => {
          console.log("*/*/**/*/*/*/*/")
          console.log(response.data.features[0].properties.distance)
          const distance = (response.data.features[0].properties.distance / 1000).toFixed(2);
          const time = Math.round(response.data.features[0].properties.time / 60);
          console.log(distance)
          console.log(time)
          console.log(response)
          setDistance(distance);
          setTime(time)

          // const route = response.data.features[0].geometry.coordinates[0];
          // console.log(route)
          // const flattenedCoordinates = route.flat(2).map(coord => [coord[1], coord[0]]);
          // console.log(flattenedCoordinates)
          // setRouteCoordinates(flattenedCoordinates);

        })
        .catch(error => {
          console.log('Error fetching route:', error);
        });
    } catch (error) {
      console.log(error)
    }
  };

  // ...

  useEffect(() => {
    if (sourceLat && sourceLng && destinationLat && destinationLng) {
      console.log('****')
      fetchRoute();
    }
  }, [sourceLat, sourceLng, destinationLat, destinationLng]);

  // Dtae Picker





  // SUBMIT button

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDates = availableDates.map(date => ({ date: format(new Date(date), 'yyyy-MM-dd') }));
    console.log(formattedDates)

    const trip = {
      source,
      destination,
      availableSeats: seats,
      distance,
      estimatedTime,
      pickupLatitude: sourceLat,
      pickupLongitude: sourceLng,
      dropLatitude: destinationLat,
      dropLongitude: destinationLng,
      description: description, // Add the description field and provide a value if necessary
      food: food, // Set the value based on the user's input or provide a default value
      smoke: smoke, // Set the value based on the user's input or provide a default value
      music: music, // Set the value based on the user's input or provide a default value
      departureTimeInput,
      type,
      availableDates: formattedDates,
      userId: userId // Update the userId value according to your logic
    };

    console.log(trip);
    axios.post("https://localhost:7095/api/Trip/addTrip", trip)
      .then((response) => {
        console.log("Trip created successfully!", response.data);
        alert("Your Carpool has been Added successfully");
        window.location.reload(); 

      })
      .catch((error) => {
        console.error(error.response.data);
      });


    setSource('');
    setDestination('');
    setSeats(1);
    setDistance('');
    setTime('');
    setType('');
    setAvailableDates([]);
    setDepartureTimeInput(null);
  };

  // ...




  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2 }}>
      <Typography variant="h6" gutterBottom>

      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Source and Destination Selection */}
        {activeStep === 0 && (
          <React.Fragment>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h1">Step 1</Typography>


              <div>
                <h2>Choose your Source</h2>
                <Autocomplete
                  options={autocompleteResults}
                  getOptionLabel={(option) => option.properties.formatted}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Source"
                      variant="outlined"
                      onChange={(event) => handleSearchQueryChange(event.target.value, 'source')}
                    />
                  )}

                  onChange={(event, value) => handleLocationSelect(value, 'source')} // Call handleLocationSelect with the selected location
                />
              </div>

              <div>
                <h2>Choose your Destination</h2>
                <Autocomplete
                  options={autocompleteResults}
                  getOptionLabel={(option) => option.properties.formatted}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destination"
                      variant="outlined"
                      onChange={(event) =>
                        handleSearchQueryChange(event.target.value, 'destination')
                      }
                    />
                  )}
                  onChange={(event, value) => handleLocationSelect(value, 'destination')}
                />
              </div>

              <div>
                <h2>View Map</h2>
                <MapContainer center={[36.862499, 10.195556]} zoom={13} style={{ height: '400px', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="Map data &copy; OpenStreetMap contributors"
                  />
                  {sourceLng && sourceLat && <Marker position={[sourceLat, sourceLng]} />}
                  {destinationLng && destinationLat && <Marker position={[destinationLat, destinationLng]} />}
                  {/* {routeCoordinates && routeCoordinates.length > 1 && <Polyline positions={routeCoordinates} />} */}
                  {/* {routeCoordinates && <Polyline positions={routeCoordinates} />} */}
                </MapContainer>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Typography variant="h2" gutterBottom>
                  Route Info
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="distance-input"
                      label="Distance (km)"
                      variant="outlined"
                      value={distance}
                      aria-readonly
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="time-input"
                      label="Estimated Time (minutes)"
                      variant="outlined"
                      value={estimatedTime}
                      aria-readonly
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>



            </Box>
          </React.Fragment>
        )}

        {/* Step 2: Additional Form */}
        {activeStep === 1 && (
          <React.Fragment>
            {/* Add your form fields for Step 2 here */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h1">Step 2</Typography>
              <div style={{ marginBottom: '1rem' }}>
                <Typography variant="h2" component="h2">
                  Choose your Available Seats
                </Typography>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Stepper nonLinear activeStep={seats - 1}>
                      {[...Array(6)].map((_, index) => (
                        <Step key={index}>
                          <StepButton
                            onClick={() => setSeats(index + 1)}
                            icon={index + 1}
                          />
                        </Step>
                      ))}
                    </Stepper>
                  </Grid>
                  <Grid item>
                    <IconButton
                      type="button"
                      onClick={handleSeatDecrement}
                      disabled={seats === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant="h3" component="span">
                      {seats}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      type="button"
                      onClick={handleSeatIncrement}
                      disabled={seats === 6}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Typography variant="h2" gutterBottom>
                  Choose your Trip Date(s)
                </Typography>

                <DatePicker value={availableDates} onChange={handleDateChange} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
              <Typography variant="h2" gutterBottom>
                  Choose your Trip Time
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Basic time picker"
                    value={departureTimeInput}
                    onChange={handleTimeChange}
                    ampm
                  />
                </LocalizationProvider>
              </div>

               <h2>Click to Select Preferences</h2>         
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ marginRight: '50px' }}>
                  {food ? (
                    <img src={foodIcon} alt="Food" onClick={handleFoodClick} style={{ width: '52px', height: '52px' }} />
                  ) : (
                    <img src={noFoodIcon} alt="No Food" onClick={handleFoodClick} style={{ width: '52px', height: '52px' }} />
                  )}
                </div>
                <div style={{ marginRight: '50px' }}>
                  {smoke ? (
                    <img src={smokeIcon} alt="Smoking" onClick={handleSmokeClick} style={{ width: '52px', height: '52px' }} />
                  ) : (
                    <img src={noSmokeIcon} alt="No Smoking" onClick={handleSmokeClick} style={{ width: '52px', height: '52px' }} />
                  )}
                </div>
                <div>
                  {music ? (
                    <img src={musicIcon} alt="Music" onClick={handleMusicClick} style={{ width: '52px', height: '52px' }} />
                  ) : (
                    <img src={noMusicIcon} alt="No Music" onClick={handleMusicClick} style={{ width: '52px', height: '52px' }} />
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
              <Typography variant="h2" gutterBottom>
                 Add Description
                </Typography>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter a description..."
                />
              </div>



            </Box>
          </React.Fragment>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep !== steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}

let DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",

});
L.Marker.prototype.options.icon = DefaultIcon;
