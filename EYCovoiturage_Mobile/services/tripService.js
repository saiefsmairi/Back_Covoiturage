import axios from 'axios'
const API_URL = '/users/'

// Register user
const createTrip = async (userData) => {
  const response = await axios.post("https://localhost:7116/api/Auth/register", userData)

  /*  if (response.data) {
     localStorage.setItem('user', JSON.stringify(response.data))
   }
  */
  return response.data
}



const tripService = {
    createTrip
}

export default tripService