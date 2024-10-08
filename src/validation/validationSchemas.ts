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

const title = z
  .string()
  .trim()
  .min(3, { message: 'Title must be at least 3 characters' })
  .max(60, { message: 'Title must be at most 60 characters' });

const body = z
  .string()
  .trim()
  .min(3, { message: 'Body must be at least 3 characters' })
  .max(1_000, { message: 'Body must be at most 1,000 characters' });

const locked = z.boolean();

const notePassword = z
  .string({ required_error: 'notePassword required' })
  .min(4, { message: 'Password must be at least 4 characters' })
  .max(20, { message: 'Password must be at most 20 characters' });

const notePasswordOptional = z.preprocess(
  arg => (typeof arg === 'string' && arg === '' ? undefined : arg),
  z
    .string()
    .min(4, {
      message: 'Password must be at least 4 characters',
    })
    .max(20, {
      message: 'Password must be at most 20 characters',
    })
    .optional()
);

export const noteSchema = z
  .object({
    title,
    body,
    locked,
    notePassword: notePasswordOptional,
    confirmNotePassword: notePasswordOptional,
  })
  .required()
  .refine(data => !data.locked || (data.locked && data.notePassword), {
    message: 'Enter password',
    path: ['notePassword'],
  })
  .refine(data => data.notePassword === data.confirmNotePassword, {
    message: 'Passwords do not match',
    path: ['confirmNotePassword'],
  });

export const lockNoteSchema = z
  .object({
    notePassword,
    confirmNotePassword: notePassword,
  })
  .required()
  .refine(data => data.notePassword === data.confirmNotePassword, {
    message: 'Passwords do not match',
    path: ['confirmNotePassword'],
  });

export const unlockNoteSchema = z.object({ notePassword }).required();

export const updateNoteSchema = z.object({ title, body }).required();

export const notePasswordSchema = z.object({ notePassword }).required();

export const userRegisterSchema = z
  .object({ name, email, password, confirmPassword: password })
  .required()
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({ email, password }).required();

export const passwordResetSchema = z.object({ email }).required();

export const newPasswordResetSchema = z
  .object({ password, confirmPassword: password })
  .required()
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const emailVerificationSchema = z.object({ email }).required();
