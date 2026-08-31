import userService from '@/src/services/user';
import { config } from 'dotenv';
import path from 'path';
import storeService from '@/src/services/store';

config({ path: path.resolve(__dirname, '../../.env.development') });

async function seed() {
  const store = await storeService.create('vorks');
  const store2 = await storeService.create('nafe');
  await userService.create({
    fullName: 'Dev Example',
    email: 'dev@vorks.com',
    storeId: store.id,
    password: '123',
  });
  await userService.create({
    fullName: 'Dev2 Example',
    email: 'dev2@vorks.com',
    storeId: store2.id,
    password: '123',
  });
  console.log('Usuários de desenvolvimento criado.');
}

seed();
