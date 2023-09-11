//import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/system';
import userImageTest from './../../images/userImageTest.png';
import { TabContext } from '@mui/lab';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React, { useState, useEffect } from 'react';


const HelloTest = () => {
  const [value, setValue] = React.useState('0');
  const [userData, setUserData] = React.useState(null);
  const [saveChangesVisible, setSaveChangesVisible] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const inputRefs = React.useRef({}); // Ref to store cursor positions
  const [modalOpen, setModalOpen] = React.useState(false);
  const [profileImage, setProfileImage] = useState('');


  React.useEffect(() => {
    // Retrieve the userId from local storage
    const userId = localStorage.getItem('userId');

    if (userId) {
      // Fetch the API data
      fetch(`https://localhost:7031/api/User/${userId}`)
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error(error));
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    fetch(`https://localhost:7031/api/User/${userId}/profileImage`)
      .then(response => response.text())
      .then(data => setProfileImage(data))
      .catch(error => console.error(error));
  }, []);


  const handleEditProfile = () => {
    setSaveChangesVisible(true); // Show the "Save Changes" button
    setEditMode(true); // Enable edit mode for text fields
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const ModalContent = () => (
    <Box sx={modalStyle}>
      <Typography sx={{ mt: 2 }} variant="h4" component="h2">
        Your profile has been updated successfully
      </Typography>
    </Box>
  );

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    window.location.reload();
  };

  const StyledTabPanel = styled(TabPanel)(({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    padding: 20px 12px;
    background: none;
    border: none;
    height: calc(100% - 100px);
  `);

  const handleSaveChanges = () => {
    if (!userData) return; // Return if userData is not available

    const userId = localStorage.getItem('userId');

    // Prepare the request body
    const requestBody = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      adress: userData.adress,
      email: userData.email
    };

    // Make the API call
    fetch(`https://localhost:7031/api/User/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        console.log('User information updated successfully:', data);
        openModal();
      })
      .catch(error => console.error('Error updating user information:', error));
  };

  const handleFieldChange = (field, event) => {
    const { selectionStart } = event.target; // Store the current cursor position
    setUserData(prevData => ({
      ...prevData,
      [field]: event.target.value
    }));
    setTimeout(() => {
      const inputRef = inputRefs.current[field];
      if (inputRef) {
        inputRef.selectionStart = selectionStart; // Restore the cursor position
        inputRef.selectionEnd = selectionStart;
        inputRef.focus(); // Restore focus to the input field
      }
    }, 0);
  };

  const handleFocus = (event, field) => {
    // Set the stored cursor position when the input field gains focus
    const inputRef = inputRefs.current[field];
    if (inputRef) {
      const { value, selectionStart } = event.target;
      inputRef.cursorPosition = selectionStart;
    }
  };

  const handleKeyDown = (event, field) => {
    // Update the cursor position on each keydown event
    const inputRef = inputRefs.current[field];
    if (inputRef) {
      const { selectionStart } = event.target;
      inputRef.cursorPosition = selectionStart;
    }
  };

  const renderTextField = (label, field) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '32px',
          }}
        >
          {label}:
        </h2>
        <Input
          value={userData ? userData[field] : ''}
          inputProps={{
            'aria-label': label,
            readOnly: !editMode,
            ref: input => (inputRefs.current[field] = input),
            onFocus: event => handleFocus(event, field),
            onKeyDown: event => handleKeyDown(event, field)
          }}
          sx={{
            marginLeft: '40px',
            width: '100%',
          }}
          readOnly={!editMode}
          onChange={event => handleFieldChange(field, event)}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f0f0',
      }}
    >
      <div
        style={{
          width: '80%',
          height: '80%',
          padding: '350px',
          position: 'relative',
          background: '#ffffff',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          overflow: 'auto',
        }}
      >
        <Avatar
          alt="Avatar"
          src={profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          sx={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            width: '350px',
            height: '350px',
            filter: editMode ? 'blur(2px)' : 'none',
          }}
        />


        {!editMode && !saveChangesVisible && (
          <Button
            variant="contained"
            onClick={handleEditProfile}
            sx={{
              position: 'absolute',
              top: '120px',
              right: '110px',
              fontSize: '1.2rem',
              padding: '12px 24px',
              height: '40px',
            }}
          >
            Edit Profile
          </Button>
        )}

        {editMode && (
          <div
            style={{
              position: 'absolute',
              top: '225px',
              left: '225px',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={() => { }}
              sx={{
                fontSize: '1.1rem',
                padding: '12px 24px',
                height: '40px',
              }}
            >
              Update Profile Picture
            </Button>
          </div>
        )}


        {saveChangesVisible && (
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              bottom: '50px',
              right: '200px',
              fontSize: '1.2rem',
              padding: '12px 24px',
              height: '40px',
            }}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        )}

        <Modal
          open={modalOpen}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalContent />
        </Modal>



        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              position: 'absolute',
              top: '420px',
              left: '50px',
              width: 'calc(100% - 100px)',
            }}
          >
            <Tab label="About" value="0" />
            <Tab label="My car" value="1" />
            <Tab label="UPCOMING Trip(s)" value="2" />
          </Tabs>
          <StyledTabPanel value="0">
            <div
              style={{
                display: 'grid',
                gap: '10px',
                padding: '0 40px',
                position: 'absolute',
                bottom: '60px',
                right: '400px',
              }}
            >
              {renderTextField('First name', 'firstName')}
              {renderTextField('Last name', 'lastName')}
              {renderTextField('Phone number', 'phone')}
              {renderTextField('Address', 'adress')}
              {renderTextField('EY Email address', 'email')}
            </div>
          </StyledTabPanel>
          <StyledTabPanel value="1">My car</StyledTabPanel>
          <StyledTabPanel value="2">UPCOMING Trip(s)</StyledTabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default HelloTest;
