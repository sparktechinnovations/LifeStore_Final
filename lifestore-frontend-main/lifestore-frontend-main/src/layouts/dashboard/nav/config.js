

const navConfig = [
  {
    title: 'Admin Dashboard',
    path: '/dashboard/app',
  },
 
  { title: 'Tables',
  children: [
  {
    title: 'Admin Table',
    path: '/dashboard/admin',
  },
  {
    title: 'Customer Table',
    path: '/dashboard/user',
  },
  {
    title: 'Agents Table',
    path: '/dashboard/agent',

  },
  {
    title: 'Store Table',
    path: '/dashboard/store',
  },
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
    title: "Commissions",
    children: [
      {
        title: 'Store Commissions',
        path: '/dashboard/storeCommission',
      },
      {
        title: 'Agent Commissions',
        path: '/dashboard/agentCommission',
      }
    ]
  },
  {
    title:"Payments",
    children: [
      {
        title:'Store Payments',
        path:'/dashboard/storePayments'
      },
      {
        title:'Agent Payments',
        path:'/dashboard/agentPayments'
      }
    ]
  },
  {
    title: 'Trash',
    children:[{
      title:"Admin Trash",
    path: '/dashboard/trash',
  },
  {
    title:"Agent Trash",
    path:'/dashboard/AgentTrash'
  },
  {
    title:"Customer Trash",
    path:'/dashboard/CustomerTrash'
  },
  {
    title:"Store Trash",
    path:'/dashboard/StoreTrash'
  },
  {
    title:"Product Trash",
    path:'/dashboard/ProductTrash'
  }
    ]
  }
];

export default navConfig;
