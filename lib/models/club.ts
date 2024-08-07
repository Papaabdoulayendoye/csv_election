import { Schema, model, models } from "mongoose";

const clubSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    members: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Utilisateur'
    }
    ],
    createdAt: { type: Date, default: Date.now }
});

const Club = models.Club || model("Club", clubSchema);

export default Club;
