import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useGetWeeklyData = () => {
    const [dailyData,setDailyData] = useState([])
    const [weeklyData,setWeeklyData] = useState([])
    const getDailyData = async ()=>{
        return await axios.get('https://localhost:7095/api/Trip/trips/GetTripCountByDay')
    }
    const getWeeklyData = async ()=>{
        return await axios.get('https://localhost:7095/api/Trip/trips/GetTripCountByWeek')
    }
    useEffect(()=>{
        getWeeklyData().then(res=>setWeeklyData(res.data)).catch(err=>console.log(err))
        getDailyData().then(res=>setDailyData(res.data)).catch(err=>console.log(err))
    },[])
  return {
    dailyData,
    weeklyData
  }
}

export default useGetWeeklyData