export const up = (pgm) => {
  pgm.createTable('cart_items', {
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
    session_id: { type: 'varchar(255)', notNull: true },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: 'products',
      onDelete: 'CASCADE',
    },
    quantity: { type: 'integer', notNull: true, default: 1 },
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

  pgm.createIndex('cart_items', ['store_id', 'session_id']);
};

export const down = (pgm) => {
  pgm.dropTable('cart_items');
};
