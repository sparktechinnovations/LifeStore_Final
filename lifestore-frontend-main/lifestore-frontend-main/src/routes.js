import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Admin from './pages/Admin';
import Agent from './pages/Agents';
import Store from './pages/Store';
import Edit from './pages/EditPages/Edit';
import AgentCommission from './pages/AgentCommissions';
import StoreCommission from './pages/StoreCommissions';
import NewAdmin from './pages/NewPages/NewAdmin';
import NewCustomer from './pages/NewPages/NewCustomer';
import NewAgent from './pages/NewPages/NewAgent';
import NewStore from './pages/NewPages/NewStore';
import NewProduct from './pages/NewPages/NewProduct';
import Login from './pages/Login';
import EditStore from './pages/EditPages/EditStore';
import EditProduct from './pages/EditPages/EditProduct';
import Profile from './pages/Profile';
import StoreProfile from './pages/StoreProfile';
import ProductProfile from './pages/ProductProfile';
import InvoicePage from './pages/InvoicePage';
import AgentProfile from './pages/AgentProfile';
import AgentPayments from './pages/Payments/AgentPayments';
import StorePayments from './pages/Payments/StorePayments';
import EditAgent from './pages/EditPages/EditAgent';
import CustomerProfile from './pages/CustomerProfile';
import Editcustomer from './pages/EditPages/EditCustomer';
import TrashPage from './pages/TrashPage';
import AgentTrash from './pages/TrashPages/AgentTrash';
import CustomerTrash from './pages/TrashPages/CustomerTrash';
import StoreTrash from './pages/TrashPages/StoreTrash';
import ProductTrash from './pages/TrashPages/productTrash';
import ForgotPassword from './pages/ForgetPassword';


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
    { path: 'forgotPassword', element:<ForgotPassword /> },
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
        { path: 'admin', element: <AuthRedirect> <Admin /> </AuthRedirect> },
        { path: 'profile/:id?', element:<AuthRedirect><Profile /></AuthRedirect>  },
        { path: 'customerProfile/:id?', element: <AuthRedirect><CustomerProfile /></AuthRedirect> },
        { path: 'products', element: <AuthRedirect><ProductsPage /></AuthRedirect> },
        { path: 'invoice', element: <AuthRedirect><InvoicePage /></AuthRedirect> },
        { path: 'agent', element:<AuthRedirect><Agent /></AuthRedirect>  },
        { path: 'store', element: <AuthRedirect><Store /></AuthRedirect> },
        { path: 'agentCommission', element: <AuthRedirect><AgentCommission /></AuthRedirect> },
        { path: 'storeCommission', element: <AuthRedirect><StoreCommission /></AuthRedirect> },
        { path: 'newAdmin', element: <AuthRedirect><NewAdmin /></AuthRedirect> },
        { path: 'newCustomer', element: <AuthRedirect><NewCustomer /></AuthRedirect> },
        { path: 'newAgent', element: <AuthRedirect><NewAgent /></AuthRedirect> },
        { path: 'newStore', element: <AuthRedirect><NewStore /> </AuthRedirect>},
        { path: 'newProduct', element: <AuthRedirect><NewProduct /></AuthRedirect> },
        { path: 'edit/:id?', element: <AuthRedirect><Edit /></AuthRedirect> },
        { path: 'editAgent/:id?', element: <AuthRedirect><EditAgent /></AuthRedirect> },
        { path: 'editCustomer/:id?', element: <AuthRedirect><Editcustomer /></AuthRedirect> },
        { path: 'editStore/:id?', element: <AuthRedirect><EditStore /></AuthRedirect> },
        { path: 'editProduct/:id?', element: <AuthRedirect><EditProduct /></AuthRedirect> },
        { path: 'storeProfile/:id?', element: <AuthRedirect><StoreProfile /> </AuthRedirect>},
        { path: 'productProfile/:id?', element:<AuthRedirect><ProductProfile /> </AuthRedirect> },
        { path: 'agentProfile/:id?', element:<AuthRedirect><AgentProfile /></AuthRedirect>  },
        { path: 'agentPayments', element: <AuthRedirect><AgentPayments /> </AuthRedirect>},
        { path: 'storePayments', element:<AuthRedirect><StorePayments /></AuthRedirect> },
     
     


        {
          path:'trash',
          element: <AuthRedirect><TrashPage /></AuthRedirect>
        },
        {
          path:'AgentTrash',
          element: <AuthRedirect><AgentTrash /></AuthRedirect>
        },
        {
          path:'CustomerTrash',
          element: <AuthRedirect><CustomerTrash /></AuthRedirect>
        },
        {
          path:'StoreTrash',
          element: <AuthRedirect><StoreTrash /></AuthRedirect>
        },
        {
          path:'ProductTrash',
          element: <AuthRedirect><ProductTrash /></AuthRedirect>
        },
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
