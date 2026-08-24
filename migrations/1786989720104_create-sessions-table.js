export const up = (pgm) => {
  pgm.createTable('sessions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    token: {
      type: 'varchar(96)',
      notNUll: true,
      unique: true,
    },
    user_id: {
      type: 'uuid',
      notNUll: true,
      references: 'users',
      onDelete: 'Cascade',
    },
    store_id: {
      type: 'uuid',
      notNUll: true,
      references: 'stores',
      onDelete: 'Cascade',
    },
    expires_at: {
      type: 'timestamptz',
      notNUll: true,
    },
    created_at: {
      type: 'timestamptz',
      notNUll: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: 'timestamptz',
      notNUll: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

export const down = false;
