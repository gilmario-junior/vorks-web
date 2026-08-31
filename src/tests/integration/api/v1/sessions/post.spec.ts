import orchestrator from '@/src/tests/orchestrator';
import { User } from '@/src/types/user';
import { beforeAll, describe, test } from 'vitest';

beforeAll(async () => {
  await orchestrator.clearDatabase();
});

describe('POST /api/v1/sessions', () => {
  describe('Usuário anônimo', () => {
    test('Com usuário e senha corretos', async () => {
      const user: User = await orchestrator.createUser({
        password: 'Senha123',
      });
      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: 'Senha123',
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toMatchObject({
        userId: user.id,
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
      });

      expect(responseBody.features).toEqual([
        'create:session',
        'read:session',
        'update:user',
        'read:store',
        'create:product',
        'read:product',
        'update:product',
        'delete:product',
      ]);
      expect(responseBody.id).toBeTypeOf('string');
      expect(responseBody.token).toBeTypeOf('string');
      expect(responseBody.createdAt).toBeTruthy();
      expect(responseBody.expiresAt).toBeTruthy();

      const setCookies = response.headers.get('set-cookie');
      expect(setCookies).toContain(responseBody.token);
    });
  });
});
