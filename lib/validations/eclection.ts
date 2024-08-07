// lib/validations/election.ts
import * as z from 'zod';

export const ElectionValidation = z.object({
titre: z.string().nonempty('Le titre de l\'élection est requis'),
description: z.string().nonempty('La description de l\'élection est requise'),
// classeFormation:z.string().nonempty('La classe de l\'élection est requise'),
typeElection: z.string().nonempty('Le type de l\'élection est requise'),
classeFormation: z.string({message:'La classe de l\'élection est requise'}).optional().nullable(),
dateDebut: z.string().nonempty('La date de début est requise'),
dateFin: z.string().nonempty('La date de fin est requise')
.refine(val => new Date(val) > new Date(), {message : 'La date de fin doit être après la date de début'}),
});
