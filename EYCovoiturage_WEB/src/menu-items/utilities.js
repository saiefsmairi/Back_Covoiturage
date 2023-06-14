// assets
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PageviewIcon from '@mui/icons-material/Pageview';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import RequestPageIcon from '@mui/icons-material/RequestPage';

// constant
const icons = {
    NoCrashIcon,
    AddCircleIcon,
    PageviewIcon,
    RequestPageIcon,
    CallReceivedIcon,
    CallMadeIcon,
    EmergencyShareIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Carpool and Ride-Sharing management (Login Required*)',
    type: 'group',
    children: [
        {
            id: 'icons',
            title: 'My Carpoolings',
            type: 'collapse',
            icon: icons.NoCrashIcon,
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Add new Carpooling',
                    type: 'item',
                    icon: icons.AddCircleIcon,
                    url: '/icons/tabler-icons',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'View my Carpoolings',
                    type: 'item',
                    icon: icons.PageviewIcon,
                    url: '/icons/material-icons',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'icons',
            title: 'My Requests',
            type: 'collapse',
            icon: icons.RequestPageIcon,
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Requests received',
                    type: 'item',
                    icon: icons.CallReceivedIcon,
                    url: '/utils/util-color',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Requets sent',
                    type: 'item',
                    icon: icons.CallMadeIcon,
                    url: '/utils/util-shadow',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'icons',
            title: 'My Ride-Sharings',
            type: 'collapse',
            icon: icons.EmergencyShareIcon,
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Add new Ride-Sahring',
                    type: 'item',
                    icon: icons.AddCircleIcon,
                    url: '/utils/util-typography',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'View My Ride-Sharings',
                    type: 'item',
                    icon: icons.PageviewIcon,
                    url: '/utils/util-card',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default utilities;
