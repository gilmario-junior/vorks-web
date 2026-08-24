export const up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    store_id: {
      type: 'uuid',
      notNull: true,
      references: 'stores',
      onDelete: 'CASCADE',
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    price_in_cents: { type: 'integer', notNull: true },
    stock_quantity: { type: 'integer', notNull: true, default: 0 },
    images: { type: 'jsonb', default: pgm.func("'[]'::jsonb") },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('products', 'store_id');
};

export const down = (pgm) => {
  pgm.dropTable('products');
};
