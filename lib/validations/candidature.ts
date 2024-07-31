import * as z from "zod";

// Définition du schéma de validation avec zod
const PostulerValidation = z.object({
    fullName: z.string().min(1, "Nom complet requis."), // Nom complet requis
    email: z.string().email("Adresse email invalide."), // Email requis
    phone: z.string(), // Numéro de téléphone optionnel
    bio: z.string().min(1, "Brève biographie requise."), // Biographie requise
    photo: z.union([z.string().optional(), z.instanceof(File).optional()]), // URL ou chemin de photo (optionnelle)
});

export { PostulerValidation };
