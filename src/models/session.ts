import crypto from 'node:crypto';
import database from '@/src/infra/database';
import sessionService from '../services/session';

async function create(userId: string) {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(
    Date.now() + sessionService.expirationInMilliseconds,
  );

  const newSession = await runInsertQuery(token, userId, expiresAt);

  return newSession;

  async function runInsertQuery(
    token: string,
    userId: string,
    expiresAt: Date,
  ) {
    const results = await database.query({
      text: `
        INSERT INTO sessions
    (token, user_id, expires_at)
    VALUES($1,$2,$3)
    RETURNING *`,
      values: [token, userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function findOneValidByToken(token: string) {
  const result = await database.query({
    text: `select * from sessions
    where token = $1`,
    values: [token],
  });
  return result.rows[0];
}

const session = {
  create,
  findOneValidByToken,
};

export default session;
