import { getDb } from './db';

interface Conversation {
    id: string;
    user_id: string;
    summary: string;
    raw_text: string[];
    created_at: Date;
    updated_at: Date;
}

interface CreateConversationInput {
    summary: string;
    raw_text: string[];
}

export async function addConversation(userId: string, input: CreateConversationInput): Promise<Conversation> {
  try {
    const db = await getDb();
    const result = await db<Conversation[]>`
        INSERT INTO conversations (user_id, summary, raw_text)
        VALUES (${userId}, ${input.summary}, ${input.raw_text})
        RETURNING *
    `;
    return result[0];
  } catch (error) { 
    console.error('Error in addConversation:', error);
    throw error;
  }
}

export async function getConversations(userId: string): Promise<Conversation[]> {
    try {
        const db = await getDb();
        return await db<Conversation[]>`
            SELECT * FROM conversations 
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;
    } catch (error) {
        console.error('Error in getConversations:', error);
        throw error;
    }
} 