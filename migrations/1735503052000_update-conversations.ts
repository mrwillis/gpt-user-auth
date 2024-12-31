export async function up(pgm: any): Promise<void> {
    // First drop the existing content column
    pgm.dropColumn('conversations', 'content');

    // Add new columns
    pgm.addColumns('conversations', {
        summary: {
            type: 'text',
            notNull: true
        },
        raw_text: {
            type: 'text[]',  // Array of strings
            notNull: true
        }
    });
}

export async function down(pgm: any): Promise<void> {
    // Revert changes
    pgm.dropColumns('conversations', ['summary', 'raw_text']);
    
    pgm.addColumn('conversations', {
        content: {
            type: 'jsonb',
            notNull: true
        }
    });
} 