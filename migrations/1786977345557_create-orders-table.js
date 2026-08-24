export const up = (pgm) => {
  pgm.createTable('orders', {
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
    customer_email: { type: 'varchar(255)', notNull: true },
    customer_name: { type: 'varchar(255)', notNull: true },
    status: { type: 'varchar(50)', notNull: true, default: 'pending' },
    total_in_cents: { type: 'integer', notNull: true },
    stripe_checkout_session_id: { type: 'varchar(255)' },
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

  pgm.createIndex('orders', 'store_id');
  pgm.createIndex('orders', 'status');
};

export const down = (pgm) => {
  pgm.dropTable('orders');
};
