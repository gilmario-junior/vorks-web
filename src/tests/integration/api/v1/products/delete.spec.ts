import orchestrator from '@/src/tests/orchestrator';
import { User } from '@/src/types/user';
import { beforeAll, describe, test, expect } from 'vitest';

let ownerA: User;
let cookieA: string;
let ownerB: User;
let cookieB: string;

async function createProduct(cookie: string) {
  const response = await fetch('http://localhost:3000/api/v1/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ name: 'Produto para deletar', priceInCents: 1000 }),
  });
  return response.json();
}

beforeAll(async () => {
  await orchestrator.clearDatabase();
  ownerA = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookieA = await orchestrator.login(ownerA.email, 'senhaSegura123');
  ownerB = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookieB = await orchestrator.login(ownerB.email, 'senhaSegura123');
});

describe('DELETE /api/v1/products/[id]', () => {
  test('Tentando deletar produto de outra loja', async () => {
    const productA = await createProduct(cookieA);

    const response = await fetch(
      `http://localhost:3000/api/v1/products/${productA.id}`,
      { method: 'DELETE', headers: { Cookie: cookieB } },
    );

    expect(response.status).toBe(403);
  });

  test('Deletando produto da própria loja', async () => {
    const productA = await createProduct(cookieA);

    const response = await fetch(
      `http://localhost:3000/api/v1/products/${productA.id}`,
      { method: 'DELETE', headers: { Cookie: cookieA } },
    );

    expect(response.status).toBe(204);

    const getResponse = await fetch(
      `http://localhost:3000/api/v1/products/${productA.id}`,
      { headers: { Cookie: cookieA } },
    );
    expect(getResponse.status).toBe(404);
  });

  test('Deletando produto inexistente', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/products/00000000-0000-0000-0000-000000000000',
      { method: 'DELETE', headers: { Cookie: cookieA } },
    );

    expect(response.status).toBe(404);
  });
});
