import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  company: faker.phone.number(),
  email:sample([
    'abcchsdhvjcbs@gmail.com',
    'jnvbjdbfv@gmail.com',
    'fjvbdjfvb@hotmail.com',
    'fvnbkjfvbugf@yahoo.com',
    'jdfvbdjfbv@gmail.com',
    'dbhshvcsdbchb@gmail.com',
  ]),
  createdAt:sample([
    '23-08-2022',
    '28-09-2022',
    '21-07-2022',
    '01-01-2022',
    '14-01-2022',
    '28-02-2023',
    '17-03-2023',
    '01-08-2023',
    '04-09-2023',
  ]),
  spendings: sample(['22000', '10000','45000','40000','300000','100000','50000']),
  commission: sample(['20000','100000','15000','12000','50000','40000','80000','60000','51000']),
  payments: sample(['10000','5000','20000','15000','40000','22000','12000','8000']),
  role: sample([
    'John',
    'Fedrick',
    'James',
    'Winson',
    'Toby',
    'Sheril',
    'Melvin',
    'Kevin',
    'Stokes',
    'Raina',
  ]),
  status:sample(["Paid","Partially Paid","Pending"]),
  remarks:sample([
    'Payment not recieved from store',
    'invoice not matching',
  ])
}));

export default users;
