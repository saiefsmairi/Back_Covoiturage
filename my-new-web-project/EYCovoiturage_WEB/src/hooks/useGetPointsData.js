import axios from 'axios'
import React, { useState } from 'react'

const useGetPointsData = (top) => {
    const [statingPoints,setSartingPoints] = useState([])
    const [finishingPoints,setFinishingPoints] = useState([])
  
   
      const getTopStartingPoints = async ()=>{
        return await axios.get(`https://localhost:7095/api/Trip/trips/GetTopStartingPoints?top=${top}`)
      }
      const getTopFinishingPoints = async ()=>{
        return await axios.get(`https://localhost:7095/api/Trip/trips/GetTopDestinationPoints?top=${top}`)
      }
      React.useEffect(() => {
        getTopStartingPoints().then(res=>setSartingPoints(res.data)).catch(err=>console.log(err))
        getTopFinishingPoints().then(res=>setFinishingPoints(res.data)).catch(err=>console.log(err))
       
      }, [top])
    return  {
        statingPoints,finishingPoints
    }
       
}

export default useGetPointsData