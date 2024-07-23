import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import NewProduct from './pages/NewPages/NewProduct';
import Login from './pages/Login';
import EditProduct from './pages/EditPages/EditProduct';
import StoreProfile from './pages/StoreProfile';
import ProductProfile from './pages/ProductProfile';
import ProductTrash from './pages/TrashPages/productTrash';
import Invoice from './pages/Invoice';
import ForgotPassword from './pages/ForgetPassword';
import InvoicePage from './pages/InvoicePage';
import ImportPage from './pages/ImportPage';
import StorePayments from './pages/StorePayments';

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
       
        { path: 'products', element: <AuthRedirect><ProductsPage /></AuthRedirect> },
       
       
      
        { path: 'newProduct', element: <AuthRedirect><NewProduct /></AuthRedirect> },
      
        { path: 'editProduct/:id?', element: <AuthRedirect><EditProduct /></AuthRedirect> },
        { path: 'storeProfile/:id?', element: <AuthRedirect><StoreProfile /> </AuthRedirect>},
        { path: 'productProfile/:id?', element:<AuthRedirect><ProductProfile /> </AuthRedirect> },
        { path: 'invoicePage', element:<AuthRedirect><Invoice /></AuthRedirect> },
        { path: 'invoice', element:<AuthRedirect><InvoicePage /></AuthRedirect> },
        { path: 'import', element:<AuthRedirect><ImportPage /></AuthRedirect> },
        { path: 'storePayments', element:<AuthRedirect><StorePayments /></AuthRedirect> },



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
