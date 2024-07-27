// lib/validations/signin.ts
import * as z from 'zod';

export const SignInValidation = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().nonempty('Mot de passe requis').min(6, 'Minimum 6 caractères'),
});
