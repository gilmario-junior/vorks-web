import orchestrator from '@/src/tests/orchestrator';
import { User } from '@/src/types/user';
import { beforeAll, describe, test, expect } from 'vitest';

let ownerA: User;
let cookieA: string;
let ownerB: User;
let cookieB: string;

async function createProduct(cookie: string, name: string) {
  const response = await fetch('http://localhost:3000/api/v1/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ name, priceInCents: 1000 }),
  });
  return response.json();
}

beforeAll(async () => {
  await orchestrator.clearDatabase();
  ownerA = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookieA = await orchestrator.login(ownerA.email, 'senhaSegura123');
  ownerB = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookieB = await orchestrator.login(ownerB.email, 'senhaSegura123');

  await createProduct(cookieA, 'Produto A1');
  await createProduct(cookieA, 'Produto A2');
  await createProduct(cookieB, 'Produto B1');
});

describe('GET /api/v1/products', () => {
  test('Listando produtos da própria loja', async () => {
    const response = await fetch('http://localhost:3000/api/v1/products', {
      headers: { Cookie: cookieA },
    });

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveLength(2);
    responseBody.forEach((product: { storeId: string }) => {
      expect(product.storeId).toBe(ownerA.storeId);
    });
  });

  test('Usuário anônimo tentando listar produtos', async () => {
    const response = await fetch('http://localhost:3000/api/v1/products');
    expect(response.status).toBe(403);
  });
});
