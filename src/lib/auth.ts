import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/backend/db';
export const auth = betterAuth({
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(','),
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  crossSubdomainCookies: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: false,
      maxAge: 60, // Cache duration in seconds (5 minutes)
      strategy: 'compact', // or "jwt" or "jwe"
    },
  },
});
