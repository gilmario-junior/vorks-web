import database from '../infra/database';
import { User, UserRecord } from '../types/user';

function mappingUser(userReceived: UserRecord) {
  const createdUser: User = {
    id: userReceived.id,
    fullName: userReceived.full_name,
    storeId: userReceived.store_id,
    password: userReceived.password,
    email: userReceived.email,
    features: userReceived.features,
    createdAt: userReceived.created_at.toString(),
    updatedAt: userReceived.updated_at.toString(),
  };
  return createdUser;
}
async function create(user: User) {
  const result = await database.query({
    text: `insert into users 
            (full_name, store_id, email, "password", features)
            values ($1, $2, $3, $4, $5)
            RETURNING *`,
    values: [
      user.fullName,
      user.storeId,
      user.email,
      user.password,
      user.features,
    ],
  });
  const userCreated = mappingUser(result.rows[0]);
  return userCreated;
}

async function find(where: string, values: unknown[], storeId: string) {
  const searchTerm = values[0];
  const hasSearchTerm =
    typeof searchTerm === 'string' && searchTerm.trim() !== '';
  const query = hasSearchTerm
    ? `SELECT * FROM users WHERE ${where} ILIKE $1 AND store_id = $2`
    : `SELECT * FROM users WHERE store_id = $1`;
  values.push(storeId);
  if (!hasSearchTerm) {
    values.shift();
  }
  const result = await database.query({
    text: query,
    values,
  });
  const usersTransformed: User[] = [];
  result.rows.map((user: UserRecord) => {
    usersTransformed.push(mappingUser(user));
  });
  return usersTransformed;
}

async function findByEmail(email: string) {
  const result = await database.query({
    text: 'select * from users where lower(email) = lower($1)',
    values: [email],
  });
  const userTransformed = result.rows[0]
    ? mappingUser(result.rows[0])
    : undefined;
  return userTransformed;
}

async function findByStoreName(storeName: string) {
  const result = await database.query({
    text: 'select * from users where lower(store_id) = lower($1)',
    values: [storeName],
  });
  if (!result.rows[0]) return undefined;

  const { ...userTransformed } = mappingUser(result.rows[0]);
  return userTransformed;
}

async function findOneById(userId: string) {
  const result = await database.query({
    text: `SELECT * from users
    WHERE id = $1`,
    values: [userId],
  });
  const userTransformed = result.rows[0]
    ? mappingUser(result.rows[0])
    : undefined;
  return userTransformed;
}

async function updateFeatures(userId: string, features: string[]) {
  const result = await database.query({
    text: `
          UPDATE users
          SET features = $2, 
          update_at = timezone('utc', now())
          WHERE id = $1
          RETURNING *
      `,
    values: [userId, features],
  });
  return result.rows[0];
}

const user = {
  create,
  find,
  findByEmail,
  findByStoreName,
  findOneById,
  updateFeatures,
};

export default user;
