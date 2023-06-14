// assets
//import { IconDashboard } from '@tabler/icons';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';

// constant
const icons = { TimeToLeaveIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'EY Carpooling',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Available Carpoolings',
            type: 'item',
            url: '/utils/util-card',
            icon: icons.TimeToLeaveIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
