import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const DATABASE_URL ='postgresql://neondb_owner:npg_ugkZD8oFs2aj@ep-muddy-heart-aoom5xle-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);
export const db = drizzle({ client: sql, schema });
