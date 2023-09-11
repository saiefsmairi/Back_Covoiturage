import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useGetDriverData = (top) => {
  const [mostTripsPoints,setMostTripsPoints] = useState([])
  const [mostTripsDistance,setMostTripsDistance] = useState([])
  const [mostTripsNumber,setMostTripsNumber] = useState([])
  const [mostTripsCanceled,setMostTripsCanceled] = useState([])

  const getMostTripsPoints = async ()=>{
    return await axios.get(`https://localhost:7095/api/Trip/driver/GetTopDriversWithMostTripsPoints?top=${top}`)
  }
  const getMostTripsDistance = async ()=>{
    return await axios.get(`https://localhost:7095/api/Trip/driver/GetTopDriversWithMostTripsDistance?top=${top}`)
  }
  const getMostTripNumber = async ()=>{
    return await axios.get(`https://localhost:7095/api/Trip/driver/GetTopDriversWithMostTripsNumber?top=${top}`)
  }
  const getMostTripCanceled = async ()=>{
    return await axios.get(`https://localhost:7095/api/Trip/driver/GetTopDriversWithMostCancledTrips?top=${top}`)
  }

  useEffect(() => {
    getMostTripsPoints().then((res)=>setMostTripsPoints(res.data)).catch(err=>console.log(err))
    getMostTripsDistance().then((res)=>setMostTripsDistance(res.data)).catch(err=>console.log(err))
    getMostTripNumber().then((res)=>setMostTripsNumber(res.data)).catch(err=>console.log(err))
    getMostTripCanceled().then((res)=>setMostTripsCanceled(res.data)).catch(err=>console.log(err))
  
    return () => {
        setMostTripsCanceled([])
        setMostTripsDistance([])
        setMostTripsNumber([])
        setMostTripsPoints([])
    }
  }, [top])
  

  return {mostTripsCanceled,mostTripsNumber,mostTripsDistance,mostTripsPoints}
}

export default useGetDriverData