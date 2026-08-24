import orchestrator from '@/src/tests/orchestrator';
import { User } from '@/src/types/user';
import { beforeAll, describe, test, expect } from 'vitest';

let ownerA: User;
let cookieA: string;
let ownerB: User;
let cookieB: string;
let productA: { id: string };

beforeAll(async () => {
  await orchestrator.clearDatabase();
  ownerA = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookieA = await orchestrator.login(ownerA.email, 'senhaSegura123');
  ownerB = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookieB = await orchestrator.login(ownerB.email, 'senhaSegura123');

  const response = await fetch('http://localhost:3000/api/v1/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    body: JSON.stringify({ name: 'Produto A', priceInCents: 1500 }),
  });
  productA = await response.json();
});

describe('GET /api/v1/products/[id]', () => {
  test('Buscando produto da própria loja', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/products/${productA.id}`,
      { headers: { Cookie: cookieA } },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      id: productA.id,
      storeId: ownerA.storeId,
    });
  });

  test('Tentando buscar produto de outra loja', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/products/${productA.id}`,
      { headers: { Cookie: cookieB } },
    );

    expect(response.status).toBe(403);
  });

  test('Buscando produto inexistente', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/products/00000000-0000-0000-0000-000000000000',
      { headers: { Cookie: cookieA } },
    );

    expect(response.status).toBe(404);
  });
});
