import { Elysia } from 'elysia';
import chatRoute from './modules/chat';

export const app = new Elysia({ prefix: '/api' })
  .get('/', 'Hello Nextjs')
  .use(chatRoute);
