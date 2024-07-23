

const navConfig = [
  {
    title: 'Store Dashboard',
    path: '/dashboard/app',
  },
  {
    title: 'Invoice',
    path: '/dashboard/invoicePage',
  },
  { title: 'Tables',
  children: [
  {
    title: 'Product Table',
    path: '/dashboard/products',
  },
  {
    title: 'Invoice Table',
    path: '/dashboard/invoice',
  },
]
  },
  {
    title: 'Store Payments',
    path: '/dashboard/storePayments',
  },
 


];

export default navConfig;
