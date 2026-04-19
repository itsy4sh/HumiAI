import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: 'src/backend/db/schema.ts',
  out: 'src/backend/db/migrations',
  verbose: true,
} satisfies Config;
