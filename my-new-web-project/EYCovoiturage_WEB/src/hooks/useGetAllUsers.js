import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useGetAllUsers = () => {
 const [users,setUsers] = useState([])

 const getAllUsers = async ()=>{
    return await axios.get('https://localhost:7031/api/User/all')
 }
 useEffect(()=>{
    getAllUsers().then((res)=>setUsers(res.data)).catch(err=>console.log(err))
 },[])
 return {
    users
 }
}

export default useGetAllUsers