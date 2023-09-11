import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import adminDashboard from './admin';

// ==============================|| MENU ITEMS ||============================== //


 const userMenuItems = {
        items: [dashboard, utilities]
    }

 const adminMenuItems = {
        items: [adminDashboard]
    };

export default userMenuItems
export {adminMenuItems}