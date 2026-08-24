import { beforeAll, describe, test, expect } from 'vitest';
import orchestrator from '@/src/tests/orchestrator';

describe('POST /v1/api/stores', async () => {
  beforeAll(async () => {
    await orchestrator.clearDatabase();
  });
  describe('com usuário anônimo', async () => {
    test('Com nome de loja nova', async () => {
      const response = await fetch('http://localhost:3000/api/v1/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName: 'example',
        }),
      });
      const jsonBody = await response.json();
      expect(response.status).toBe(201);
      expect(jsonBody).toMatchObject({ storeName: 'example', id: jsonBody.id });
    });

    test('Com nome de loja duplicada', async () => {
      await fetch('http://localhost:3000/api/v1/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName: 'duplicated',
        }),
      });

      const response = await fetch('http://localhost:3000/api/v1/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName: 'duplicated',
        }),
      });

      const jsonBody = await response.json();
      expect(response.status).toBe(400);
      expect(jsonBody).toMatchObject({
        action: 'Verifique se o cadastro está sendo duplicado.',
        message: 'O nome informado já está sendo utilizado',
        name: 'ValidationError',
        status_code: 400,
      });
    });
  });
});
