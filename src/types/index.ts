import { z } from 'zod';

export const SignInForm = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),

  password: z
    .string({ message: 'Password is required' })
    .min(4, { message: 'Password must be at least 4 characters' }),
});

export const SignUpForm = z.object({
  username: z
    .string({ message: 'Username is required' })
    .min(2, { message: 'Username must be at least 2 characters' }),

  email: z.email({ message: 'Please enter a valid email address' }),

  password: z
    .string({ message: 'Password is required' })
    .min(4, { message: 'Password must be at least 4 characters' }),
});
