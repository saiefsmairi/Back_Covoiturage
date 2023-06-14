import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import NewCarpoolForm from '../views/utilities/NewCarpoolForm';
import CollapsibleTable from '../views/utilities/CollapsibleTable';
import RequestSent from '../views/utilities/RequestSent';
import RequestRecieved from '../views/utilities/RequestRecieved';
import AvailableCarpoolings from '../views/utilities/AvailableCarpoolings';
import CarpoolCards from '../views/utilities/CarpoolCards';
import BasicTimePicker from '../views/utilities/BasicTimePicker';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = 
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard/default',
          element: <DashboardDefault />
        },
        {
          path: 'utils/util-card',
          element: <CarpoolCards />
        },
        {
          path: 'utils/util-typography',
          element: <AvailableCarpoolings />
        },
        {
          path: 'utils/util-color',
          element: <RequestRecieved />
        },
        {
          path: 'utils/util-shadow',
          element: <RequestSent />
        },
        {
          path: 'icons/tabler-icons',
          element: <NewCarpoolForm />
        },
        {
          path: 'icons/material-icons',
          element: <CollapsibleTable />
        },
        {
          path: 'sample-page',
          element: <BasicTimePicker />
        }
      ]
    }
  ;
  
  export default MainRoutes;