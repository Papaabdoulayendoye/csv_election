import { Schema, model, models } from "mongoose";

const candidatSchema = new Schema({
  nom: { type: String, required: true },
  programme: { type: String, required: true },
  photo: { type: String }
});

const Candidat = models.Candidat || model("Candidat", candidatSchema);

export default Candidat;
