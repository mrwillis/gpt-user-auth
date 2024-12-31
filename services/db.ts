import postgres from 'postgres';
import { getDbUsername, getDbPassword } from './ssm';
import fs from 'fs';
import path from 'path';
let sql: postgres.Sql | null = null;

export async function getDb() {
    if (!sql) {
        const username = await getDbUsername();
        const password = await getDbPassword();
        
        sql = postgres({
            host: process.env.DB_ENDPOINT,
            port: 5432,
            database: process.env.DB_NAME,
            username,
            password,
            ssl: {
              require: true,
              rejectUnauthorized: true,
              ca: fs.readFileSync(path.resolve(__dirname, './us-east-1-bundle.pem'))
            }
        });
    }
    return sql;
}