

const navConfig = [
  {
    title: 'Agent Dashboard',
    path: '/dashboard/app',
  },
  { title: 'Table',
  children: [
  {
    title: 'Customer Table',
    path: '/dashboard/user',
  },
  {
    title: 'Invoice Table',
    path: '/dashboard/invoice',
  },
]
},
{
  title: 'Agent Payments',
  path: '/dashboard/agentPayments',
},
];

export default navConfig;
