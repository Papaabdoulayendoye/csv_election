import { Schema, model, models } from "mongoose";

const electionSchema = new Schema({
  titre: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  description: { type: String, required: true },
  typeElection: { type: String, enum: ['classe', 'école', 'club'], required: true },
  classeFormation: {type:String,required:false},
  candidats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Candidature'
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
        ref: 'Candidature'
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Election = models.Election || model("Election", electionSchema);

export default Election;