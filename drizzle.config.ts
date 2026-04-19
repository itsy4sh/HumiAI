import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: 'src/backend/db/schema.ts',
  out: 'src/backend/db/migrations',
  verbose: true,
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL!,
  },
} satisfies Config;
