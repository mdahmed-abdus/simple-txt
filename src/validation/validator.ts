import { z } from 'zod';

export function validate(
  schema:
    | z.ZodObject<any>
    | z.ZodEffects<z.ZodObject<any>>
    | z.ZodEffects<z.ZodEffects<z.ZodObject<any>>>,
  data: any
) {
  const { success, error } = schema.safeParse(data);

  if (success) {
    return { success };
  }

  return { success, errorMessage: error.errors[0].message || '' };
}
