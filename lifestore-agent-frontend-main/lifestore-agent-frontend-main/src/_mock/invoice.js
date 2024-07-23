import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const invoice = [...Array(24)].map((_, index) => ({
  invoiceNum: faker.datatype.uuid(),
  name: faker.name.fullName(),
  invoiceDate:sample([
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
  invoiceAmt: sample(['220k', '100k','45k','4k','300k','1m','50k']),
  agentName: sample([
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
}));

export default invoice;
