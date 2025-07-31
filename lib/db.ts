import pg, { Client as ClientType } from 'pg';
const { Client } = pg;

// Ensure the client is globally available to avoid multiple connections
let client: ClientType | null = null;

export const connectDB = async () => {
    try {
        if (!client) {
            client = new Client({
              user: 'postgres.ybrqilxyekioignuahpx',  
              host: 'aws-0-eu-north-1.pooler.supabase.com',      
              database: 'postgres',  
              password: 'Aloyebolu.123',  
              port: 5432,
            });
            await client.connect();
            console.log('✅ Connected to PostgreSQL successfully!');
        }else{
        }
    } catch (error) {
        console.error('❌ Error connecting to PostgreSQL:', error);
        disconnectDB()
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = async (query: string, values: any[] = []) => {
    if (!client) {
        throw new Error('Database client is not connected. Call connectDB() first.');
    }
    try {
        console.log(query)
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('❌ Query execution error:', error);
        throw error;
    }
};

export const disconnectDB = async () => {
    if (client) {
        await client.end();
        client = null;
        console.log('🔌 Connection closed.');
    }
};