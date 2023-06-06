import axios from 'axios'
const API_URL = '/users/'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Register user
const register = async (userData) => {
  const response = await axios.post("https://1318-102-159-105-67.ngrok-free.app/api/User/register", userData)

  /*  if (response.data) {
     localStorage.setItem('user', JSON.stringify(response.data))
   }
  */
  return response.data
}

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post("https://31c3-102-159-105-67.ngrok-free.app/api/Auth/login", userData);
    console.log(response.data.user);

    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('User data saved successfully!');
    }

    return response.data;
  } catch (error) {
    console.log('Error during login:', error);
    throw error;
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
  getMe
}

export default authService