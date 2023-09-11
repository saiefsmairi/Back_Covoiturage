import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useGetPassengersData = (top) => {
    
    const [mostTripsPointsPassenger,setMostTripsPointsPassenger] = useState([])
    const [mostTripsCanceledPassenger,setMostTripsCanceledPassenger] = useState([])
  
   
      const getMostTripPoints = async ()=>{
        return await axios.get(`https://localhost:7095/api/Trip/passengers/GetTopPassengersWithMostTripsPoints?top=${top}`)
      }
      const getMostCanceledTrip = async ()=>{
        return await axios.get(`https://localhost:7095/api/Trip/passengers/GetTopPassengersWithMostCanceledRidesRequests?top=${top}`)
      }
      useEffect(() => {
        getMostCanceledTrip().then(res=>setMostTripsCanceledPassenger(res.data)).catch(err=>console.log(err))
        getMostTripPoints().then(res=>setMostTripsPointsPassenger(res.data)).catch(err=>console.log(err))
      
       
      }, [top])
    return  {
        mostTripsCanceledPassenger,mostTripsPointsPassenger
    }  
}

export default useGetPassengersData