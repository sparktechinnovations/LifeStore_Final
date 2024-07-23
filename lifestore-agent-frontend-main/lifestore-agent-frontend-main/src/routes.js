import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import Login from './pages/Login';

import AgentProfile from './pages/AgentProfile';

import CustomerProfile from './pages/CustomerProfile';
import NewCustomer from './pages/NewPages/NewCustomer';
import ForgotPassword from './pages/ForgotPassword';
import AgentPayments from './pages/AgentPayments';
import InvoicePage from './pages/InvoicePage';



// ----------------------------------------------------------------------

const AuthRedirect = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default function Router() {
  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />,
      index: true,
    },
    {
      path: '/forgotPassword',
      element: <ForgotPassword />,
      index: true,
    },
    {
      path: '/dashboard',
      element:<AuthRedirect><DashboardLayout /></AuthRedirect> ,
      children: [
        { element: <Navigate to="/dashboard/app" /> },
        {
          path: 'app',
          element: <AuthRedirect>
          <DashboardAppPage />
        </AuthRedirect>,
        },
        { path: 'user', element:<AuthRedirect> <UserPage /></AuthRedirect> },
        { path: 'customerProfile/:id?', element: <AuthRedirect><CustomerProfile /></AuthRedirect> },
        { path: 'agentProfile/:id?', element:<AuthRedirect><AgentProfile /></AuthRedirect>  },
        { path: 'newCustomer', element:<AuthRedirect><NewCustomer /></AuthRedirect>  },
        { path: 'agentPayments', element:<AuthRedirect><AgentPayments /></AuthRedirect>  },
        { path: 'invoice', element:<AuthRedirect><InvoicePage /></AuthRedirect>  },

       
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    
  ]);

  return routes;
}
