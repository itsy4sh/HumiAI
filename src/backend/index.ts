import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { auth } from '@/lib/auth';
import { betterAuth } from './middlewares/user';
import chatRoute from './modules/chat';

export const app = new Elysia({ prefix: '/api' });

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.get('/', () => ({ status: 'ok' }));

// BETTER AUTH
app.mount(auth.handler);
app.use(betterAuth);

//ROUTES
app.use(chatRoute);

console.log(
  `🦊 Elysia running at http://${app.server?.hostname}:${app.server?.port}`,
);
