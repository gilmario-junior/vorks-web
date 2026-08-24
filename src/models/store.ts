import database from '@/src/infra/database';
import { Store, Store_Record } from '@/src/types/store';

const mappingStoreRows = (storeRows: Store_Record): Store => {
  return {
    id: storeRows.id,
    storeName: storeRows.store_name,
    createdAt: storeRows.created_at,
    updatedAt: storeRows.updated_at,
  };
};

async function create(storeName: string) {
  const result = await database.query({
    text: ` INSERT INTO stores (store_name) values ($1) RETURNING *`,
    values: [storeName],
  });
  const storeCreated = mappingStoreRows(result.rows[0]);
  return storeCreated;
}

async function find() {
  const result = await database.query({
    text: 'SELECT * FROM stores',
  });
  return result.rows.map(mappingStoreRows);
}

async function findByStoreId(storeId: string) {
  const result = await database.query({
    text: 'SELECT * FROM stores WHERE id= $1',
    values: [storeId],
  });
  const storeFounded = result.rows[0]
    ? mappingStoreRows(result.rows[0])
    : undefined;
  return storeFounded;
}

async function findByStoreName(storeName: string) {
  const result = await database.query({
    text: 'SELECT * FROM stores WHERE store_name= $1',
    values: [storeName],
  });

  const storeFounded = result.rows[0]
    ? mappingStoreRows(result.rows[0])
    : undefined;
  return storeFounded;
}

const store = {
  create,
  find,
  findByStoreId,
  findByStoreName,
};

export default store;
