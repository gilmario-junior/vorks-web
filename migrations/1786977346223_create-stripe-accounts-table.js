export const up = (pgm) => {
  pgm.createTable('stripe_accounts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    store_id: {
      type: 'uuid',
      notNull: true,
      unique: true,
      references: 'stores',
      onDelete: 'CASCADE',
    },
    stripe_account_id: { type: 'varchar(255)' },
    onboarding_completed: { type: 'boolean', notNull: true, default: false },
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
};

export const down = (pgm) => {
  pgm.dropTable('stripe_accounts');
};
