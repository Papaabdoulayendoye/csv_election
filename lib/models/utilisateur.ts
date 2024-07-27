import { Schema, model, models } from "mongoose";

const utilisateurSchema = new Schema({
nom: { type: String, required: true },
email: { type: String, required: true, unique: true },
motDePasse: { type: String, required: true },
votes: [
{
    electionId: {
    type: Schema.Types.ObjectId,
    ref: 'Election'
    },
    candidatId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidat'
    }
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
]
});

const Utilisateur = models.Utilisateur || model("Utilisateur", utilisateurSchema);

export default Utilisateur;
