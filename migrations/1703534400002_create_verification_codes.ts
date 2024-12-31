/* eslint-disable @typescript-eslint/no-explicit-any */
export const up = (pgm: any) => {

  pgm.createTable('verification_codes', {
    id: 'serial',
    email: { type: 'varchar(255)', notNull: true },
    code: { type: 'varchar(6)', notNull: true },
    expires_at: { type: 'timestamp with time zone', notNull: true },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });

  pgm.createIndex('verification_codes', 'email');
  pgm.createIndex('verification_codes', 'expires_at');
};

export const down = (pgm: any) => {
  pgm.dropTable('verification_codes');
};