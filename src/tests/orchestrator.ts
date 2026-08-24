import { faker } from '@faker-js/faker';
import database from '@/src/infra/database';
import { exec } from 'child_process';
import { promisify } from 'node:util';
import userService from '@/src/services/user';
import retry from 'async-retry';
import storeService from '@/src/services/store';
import { User } from '@/src/types/user';
import { Store } from '@/src/types/store';
import { ValidationError } from '@/src/infra/errors';

const execAsync = promisify(exec);

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3000/api/v1/status');
      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}

async function dropDatabase() {
  await database.query('drop schema public cascade; create schema public;');
}

async function clearDatabase() {
  await clearSessions();
  await clearUsers();
  await clearProducts();
  await clearStore();
}

async function clearSessions() {
  await database.query('delete from sessions');
}

async function clearUsers() {
  await database.query('delete from users');
}

async function clearProducts() {
  await database.query('delete from products');
}

async function clearStore() {
  await database.query('delete from stores');
}

async function runPendingMigrations() {
  await execAsync('npm run migrations:up');
}

async function createUser({
  fullName,
  email,
  password,
}: {
  fullName?: string;
  email?: string;
  password?: string;
}) {
  const user: User = {
    fullName: fullName || faker.person.fullName(),
    email: email || faker.internet.email(),
    password: password || faker.internet.password(),
    storeId: '',
  };
  const store: Store = await storeService.create(faker.person.firstName());
  user.storeId = store.id || '';
  const createdUser = userService.create(user);
  return createdUser;
}
async function createStore(storeName: string = faker.person.firstName()) {
  const result = await storeService.create(storeName);
  return result;
}

async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const setCookie = response.headers.get('set-cookie');
  return setCookie ? setCookie.split(';')[0] : '';
}

const orchestrator = {
  waitForAllServices,
  dropDatabase,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createStore,
  login,
};

export default orchestrator;
