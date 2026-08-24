import orchestrator from '@/src/tests/orchestrator';
import { User } from '@/src/types/user';
import { beforeAll, describe, test, expect } from 'vitest';

let owner: User;
let cookie: string;

beforeAll(async () => {
  await orchestrator.clearDatabase();
  owner = await orchestrator.createUser({ password: 'senhaSegura123' });
  cookie = await orchestrator.login(owner.email, 'senhaSegura123');
});

describe('POST /api/v1/products', () => {
  describe('Usuário autenticado', () => {
    test('Com dados completos e válidos', async () => {
      const response = await fetch('http://localhost:3000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify({
          name: 'Camiseta Vorks',
          description: 'Camiseta 100% algodão',
          priceInCents: 5990,
          stockQuantity: 10,
          images: ['https://example.com/camiseta.png'],
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toMatchObject({
        storeId: owner.storeId,
        name: 'Camiseta Vorks',
        description: 'Camiseta 100% algodão',
        priceInCents: 5990,
        stockQuantity: 10,
        images: ['https://example.com/camiseta.png'],
      });
      expect(responseBody.id).toBeTypeOf('string');
      expect(responseBody.createdAt).toBeTruthy();
      expect(responseBody.updatedAt).toBeTruthy();
    });

    test('Com apenas os campos obrigatórios', async () => {
      const response = await fetch('http://localhost:3000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify({
          name: 'Caneca Vorks',
          priceInCents: 2990,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toMatchObject({
        storeId: owner.storeId,
        name: 'Caneca Vorks',
        description: null,
        priceInCents: 2990,
        stockQuantity: 0,
        images: [],
      });
    });

    test('Ignorando storeId enviado no corpo da requisição', async () => {
      const response = await fetch('http://localhost:3000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify({
          name: 'Produto com storeId forjado',
          priceInCents: 1000,
          storeId: '00000000-0000-0000-0000-000000000000',
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody.storeId).toBe(owner.storeId);
    });
  });

  describe('Usuário anônimo', () => {
    test('Tentando criar produto', async () => {
      const response = await fetch('http://localhost:3000/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Produto anônimo',
          priceInCents: 1000,
        }),
      });

      expect(response.status).toBe(403);
    });
  });
});
