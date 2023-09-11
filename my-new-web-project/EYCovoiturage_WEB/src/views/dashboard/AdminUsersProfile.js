import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import useGetAllUsers from 'hooks/useGetAllUsers'
import React, { useState } from 'react'

const AdminUsersProfile = () => {
  const {users} = useGetAllUsers()
  
  return (
    <Table size="small" aria-label="requests" style={{
      backgroundColor:'white',
      borderRadius:6,
      marginTop:20
    }}>
    <TableHead>
      <TableRow>
        <TableCell>First name</TableCell>
        <TableCell>Last name</TableCell>
        <TableCell>Phone number</TableCell>
        <TableCell>Address</TableCell>
        <TableCell>EY mail</TableCell>
        {/* <TableCell>Action</TableCell> */}
      </TableRow>
    </TableHead>
    <TableBody>    
      {users.map((item,idx)=>(
        <TableRow key={idx} sx={{height:80}}>
          <TableCell>{item.firstName}</TableCell>
          <TableCell>{item.lastName}</TableCell>
          <TableCell>{item.phone}</TableCell>
          <TableCell>{item.adress}</TableCell>
          <TableCell>{item.email}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  )
}

export default AdminUsersProfile