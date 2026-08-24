export const up = (pgm) => {
  pgm.createTable('order_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    order_id: {
      type: 'uuid',
      notNull: true,
      references: 'orders',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: 'products',
      onDelete: 'RESTRICT',
    },
    quantity: { type: 'integer', notNull: true },
    unit_price_in_cents: { type: 'integer', notNull: true },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('order_items', 'order_id');
  pgm.createIndex('order_items', 'product_id');
};

export const down = (pgm) => {
  pgm.dropTable('order_items');
};
