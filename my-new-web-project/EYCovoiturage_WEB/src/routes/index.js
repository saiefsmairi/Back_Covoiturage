import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes, { AdminRoutes, UserRoutes } from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import useMainRoutes from './MainRoutes';
import { useAuthContext } from 'context/auth';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const {role} = useAuthContext()
   const mainRoutes = role === 'User' ? UserRoutes : AdminRoutes
  
     return useRoutes([mainRoutes, AuthenticationRoutes]);
}
