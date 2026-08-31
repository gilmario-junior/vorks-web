import orchestrator from '@/src/tests/orchestrator';
import { Store } from '@/src/types/store';
import { beforeAll, describe, test, expect } from 'vitest';

let store: Store;
beforeAll(async () => {
  await orchestrator.clearDatabase();
  store = await orchestrator.createStore();
});

describe('POST /api/v1/users', () => {
  describe('Usuário anônimo', () => {
    test('Com dados únicos e válidos', async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: 'Example Test',
          storeId: store.id,
          email: 'store@example.com',
          password: 'senhaSegura123',
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        fullName: 'Example Test',
        storeId: store.id,
        email: 'store@example.com',
        password: responseBody.password,
        features: [
          'create:session',
          'read:session',
          'update:user',
          'read:store',
          'create:product',
          'read:product',
          'update:product',
          'delete:product',
        ],
        createdAt: responseBody.createdAt,
        updatedAt: responseBody.updatedAt,
      });

      expect(responseBody.password).not.toBe('senhaSegura123');
    });

    test('with duplicated email', async () => {
      await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Primeiro Usuário',
          storeId: store.id,
          email: 'duplicado@vorks.com',
          password: 'senha123',
        }),
      });

      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Segundo Usuário',
          storeId: store.id,
          email: 'Duplicado@vorks.com',
          password: 'outraSenha123',
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: 'ValidationError',
        message: 'O email informado já está sendo utilizado',
        action: 'Utilizar um email diferente para esta ação!',
        status_code: 400,
      });
    });
  });
});
