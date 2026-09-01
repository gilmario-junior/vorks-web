export const up = (pgm) => {
  pgm.createTable('payment_accounts', {
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
    provider: {
      type: 'varchar(50)',
      notNull: true,
      check: "provider IN ('infinitepay', 'stripe', 'mercadopago')",
    },
    external_account_id: { type: 'varchar(255)' },
    metadata: {
      type: 'jsonb',
      notNull: true,
      default: pgm.func("'{}'::jsonb"),
    },
    is_default: { type: 'boolean', notNull: true, default: false }, // qual usar por padrão no checkout
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

  // uma loja não pode ter dois cadastros do MESMO provedor
  pgm.addConstraint('payment_accounts', 'unique_store_provider', {
    unique: ['store_id', 'provider'],
  });

  pgm.createIndex('payment_accounts', 'store_id');
};

export const down = (pgm) => {
  pgm.dropTable('payment_accounts');
};
