import database from '../infra/database';
import {
  Product,
  ProductRecord,
  UpdateProductInput,
} from '../types/product';

function mappingProduct(productReceived: ProductRecord) {
  const product: Product = {
    id: productReceived.id,
    storeId: productReceived.store_id,
    name: productReceived.name,
    description: productReceived.description,
    priceInCents: productReceived.price_in_cents,
    stockQuantity: productReceived.stock_quantity,
    images: productReceived.images,
    createdAt: productReceived.created_at.toString(),
    updatedAt: productReceived.updated_at.toString(),
  };
  return product;
}

async function create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const result = await database.query({
    text: `insert into products
            (store_id, name, description, price_in_cents, stock_quantity, images)
            values ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
    values: [
      product.storeId,
      product.name,
      product.description,
      product.priceInCents,
      product.stockQuantity,
      JSON.stringify(product.images),
    ],
  });
  const productCreated = mappingProduct(result.rows[0]);
  return productCreated;
}

async function findByStoreId(storeId: string) {
  const result = await database.query({
    text: `SELECT * FROM products WHERE store_id = $1 ORDER BY created_at DESC`,
    values: [storeId],
  });
  return result.rows.map(mappingProduct);
}

async function findById(productId: string) {
  const result = await database.query({
    text: `SELECT * FROM products WHERE id = $1`,
    values: [productId],
  });
  const productFounded = result.rows[0]
    ? mappingProduct(result.rows[0])
    : undefined;
  return productFounded;
}

const updateColumnByField: Record<keyof UpdateProductInput, string> = {
  name: 'name',
  description: 'description',
  priceInCents: 'price_in_cents',
  stockQuantity: 'stock_quantity',
  images: 'images',
};

async function update(productId: string, product: UpdateProductInput) {
  const fields: string[] = [];
  const values: unknown[] = [];

  (Object.keys(product) as (keyof UpdateProductInput)[]).forEach((field) => {
    const value = product[field];
    if (value === undefined) return;
    values.push(field === 'images' ? JSON.stringify(value) : value);
    fields.push(`${updateColumnByField[field]} = $${values.length}`);
  });

  fields.push(`updated_at = timezone('utc', now())`);
  values.push(productId);

  const result = await database.query({
    text: `UPDATE products SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values,
  });
  const productUpdated = result.rows[0]
    ? mappingProduct(result.rows[0])
    : undefined;
  return productUpdated;
}

async function remove(productId: string) {
  const result = await database.query({
    text: `DELETE FROM products WHERE id = $1 RETURNING *`,
    values: [productId],
  });
  const productRemoved = result.rows[0]
    ? mappingProduct(result.rows[0])
    : undefined;
  return productRemoved;
}

const product = {
  create,
  findByStoreId,
  findById,
  update,
  remove,
};

export default product;
