// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import { useAuthContext } from 'context/auth';
import { useEffect, useState } from 'react';
import userMenuItems, { adminMenuItems } from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const [items,setItems] = useState([])
    const {role} = useAuthContext()
    
    useEffect(()=>{
        if(role === "Admin"){
            setItems(adminMenuItems)
        }else{setItems(userMenuItems)}
    },[role])

    const navItems = items?.items?.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
