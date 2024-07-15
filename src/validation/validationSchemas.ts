import { z } from 'zod';

const name = z
  .string()
  .trim()
  .min(3, { message: 'Name must be at least 3 characters' })
  .max(128, { message: 'Name must be at most 128 characters' });

const email = z
  .string()
  .trim()
  .email({ message: 'Invalid email address' })
  .min(8, { message: 'Email must be at least 8 characters' })
  .max(254, { message: 'Email must be at most 254 characters' });

const password = z
  .string()
  .trim()
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u, {
    message:
      'Password must contain at least: 1 uppercase, 1 lowercase, 1 digit',
  })
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(72, { message: 'Password must be at most 72 characters' });

export const noteSchema = z
  .object({
    title: z.string().trim().min(3).max(60),
    body: z.string().trim().min(3).max(1_000),
  })
  .required();

export const userRegisterSchema = z
  .object({ name, email, password, confirmPassword: password })
  .required()
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({ email, password }).required();

export const passwordResetSchema = z.object({ email }).required();

export const emailVerificationSchema = z.object({ email }).required();
