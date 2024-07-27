import { Schema, model, models } from "mongoose";

const electionSchema = new Schema({
  titre: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  description: { type: String, required: true },
  candidats: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Candidat'
      },
      nom: { type: String, required: true },
      programme: { type: String, required: true },
      photo: { type: String }
    }
  ],
  votes: [
    {
      electeurId: {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur'
      },
      candidatId: {
        type: Schema.Types.ObjectId,
        ref: 'Candidat'
      }
    }
  ]
});

const Election = models.Election || model("Election", electionSchema);

export default Election;
