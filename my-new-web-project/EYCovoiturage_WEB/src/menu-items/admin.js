// assets
//import { IconDashboard } from '@tabler/icons';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';

// constant
const icons = { TimeToLeaveIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const adminDashboard = {
    id: 'dashboard',
    title: 'DashBoard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'DashBoard',
            type: 'item',
            url: '/admin',
            icon: icons.TimeToLeaveIcon,
            breadcrumbs: false
        },
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/admin/users',
            icon: icons.TimeToLeaveIcon,
            breadcrumbs: false
        }
    ]
};

export default adminDashboard;
