import userService from '@/src/services/user';
import { config } from 'dotenv';
import path from 'path';
import storeService from '@/src/services/store';

config({ path: path.resolve(__dirname, '../../.env.development') });

async function seed() {
  const store = await storeService.create('vorks');
  await userService.create({
    fullName: 'Usuário Dev',
    email: 'dev@vorks.com',
    storeId: store.id,
    password: '123',
  });
  console.log('Usuário de desenvolvimento criado.');
}

seed();
