import axios from 'axios'
const API_URL = '/users/'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Register user
const register = async (userData) => {
  const response = await axios.post("https://3d7f-102-156-193-206.ngrok-free.app/api/User/register", userData)

  /*  if (response.data) {
     localStorage.setItem('user', JSON.stringify(response.data))
   }
  */
  return response.data
}

// Login user
const login = async (userData) => {
  console.log(userData)
  try {
    const response = await axios.post("https://3d7f-102-156-193-206.ngrok-free.app/api/Auth/login", userData);
    console.log(response);

    if (response.data) {
      await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
      console.log('Login success & User data saved successfully!');
    }
    return response;

  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Log the message when credentials are invalid
      console.log('Invalid Credentials');
    } else {
      console.log('Error during login:', error);
    }
  }
};


const loginemulator = async (userData) => {
  console.log(userData)
  try {
    const response = await axios.post("https://3d7f-102-156-193-206.ngrok-free.app/api/Auth/loginEmulator", userData);
    console.log(response.data.user);

    if (response.data) {
      await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
      console.log('Login success & User data saved successfully!');
    }

    return response;
  } catch (error) {
    console.log('Error during login:', error);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}


// getme user
const getMe = async () => {
  const userlogged = JSON.parse(localStorage.getItem("user"))
  const AuthStr = 'Bearer '.concat(userlogged.token);
  const response = await axios.get('http://localhost:5000/users/me', { headers: { Authorization: AuthStr } });
  return response.data
}


const authService = {
  register,
  logout,
  login,
  loginemulator,
  getMe
}

export default authService