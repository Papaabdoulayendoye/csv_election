// import { Schema, model, models } from "mongoose";

// const candidatSchema = new Schema({
//   nom: { type: String, required: true },
//   programme: { type: String, required: true },
//   photo: { type: String }
// });

// const Candidat = models.Candidat || model("Candidat", candidatSchema);

// export default Candidat;


import { Schema, model, models } from "mongoose";

const candidatureSchema = new Schema({
  utilisateurId: {
    type: Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  electionId: {
    type: Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  bio: { type: String, required: true },
  photo: { type: String, required: false }, // URL ou chemin de fichier
  status: { type: String, enum: ['en attente', 'accepté', 'rejeté'], default: 'en attente' },
  createdAt: { type: Date, default: Date.now }
});

const Candidature = models.Candidature || model("Candidature", candidatureSchema);

export default Candidature;
