// lib/validations/register.ts
import * as z from 'zod';

export const RegisterValidation = z.object({
  nom: z.string().nonempty('Mot de passe requis').min(4, 'Minimum 4 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().nonempty('Mot de passe requis').min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string().nonempty('Confirmation du mot de passe requise').min(6, 'Minimum 6 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});
