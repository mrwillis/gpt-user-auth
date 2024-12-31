export async function up(pgm: any): Promise<void> {
    pgm.createTable('conversations', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'text',
            notNull: true,
            primaryKey: true
        },
        content: {
            type: 'jsonb',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    });

    // Add index on user_id for faster lookups
    pgm.createIndex('conversations', 'user_id');
}

export async function down(pgm: any): Promise<void> {
    pgm.dropTable('conversations');
} 