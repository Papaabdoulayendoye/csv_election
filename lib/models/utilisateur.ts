import { Schema, model, models } from "mongoose";

const utilisateurSchema = new Schema({
nom: { type: String, required: true },
email: { type: String, required: true, unique: true },
motDePasse: { type: String, required: true },
telephone: { type: String, required: false },
bio: { type: String, required: false },
photo: { type: String, required: false }, // URL ou chemin de fichier
status: { type: String, enum: ['activé', 'desactivité'], default: 'desactivité' },
votes: [
{
    electionId: {
    type: Schema.Types.ObjectId,
    ref: 'Election'
    },
    candidatId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidat'
    },
    createdAt: { type: Date, default: Date.now }
}
],
candidatures: [
{
    electionId: {
    type: Schema.Types.ObjectId,
    ref: 'Election'
    },
    status: { type: String } // Ex: "accepté", "rejeté", "en attente"
}
],
createdAt: { type: Date, default: Date.now }
});

const Utilisateur = models.Utilisateur || model("Utilisateur", utilisateurSchema);

export default Utilisateur;
