export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    full_name: {
      type: 'varchar(110)',
      notNull: true,
    },
    features: { type: 'varchar[]', notNull: true, default: '{}' },
    email: {
      type: 'varchar(254)',
      notNull: true,
      unique: true,
    },
    store_id: {
      type: 'uuid',
      notNull: true,
      references: 'stores',
      onDelete: 'CASCADE',
    },
    password: {
      type: 'varchar(60)',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
  pgm.createIndex('users', 'store_id');
};

export const down = (pgm) => {
  pgm.dropTable('users');
};
