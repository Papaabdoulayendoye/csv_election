import { Schema, model, models } from "mongoose";

const administrateurSchema = new Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Administrateur = models.Administrateur || model("Administrateur", administrateurSchema);

export default Administrateur;
