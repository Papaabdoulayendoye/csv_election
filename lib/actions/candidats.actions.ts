"use server"

import { CandidatureProps } from '@/types';
import { connectToDB } from '../mongoose';
import Candidature from '../models/candidat';
import Election from '../models/election';
import { parseStringify } from '../utils';



export async function createCandidature(candidatureData: CandidatureProps) {
await connectToDB();
try {
const newCandidature = new Candidature({
    utilisateurId: candidatureData.utilisateurId,
    electionId: candidatureData.electionId,
    fullName: candidatureData.fullName,
    email: candidatureData.email,
    phone: candidatureData.phone,
    bio: candidatureData.bio,
    photo: candidatureData.photo,
    status: 'en attente',
    createdAt: Date.now(),
});

await newCandidature.save();
// await Election.findByIdAndUpdate(
//   candidatureData.electionId,
//   { $push: { candidats: { id: newCandidature._id, nom: candidatureData.fullName, programme: candidatureData.bio, photo: candidatureData.photo } } },
//   { new: true }
// );

return { message: "Candidature créée avec succès" };
} catch (error: any) {
throw new Error("Échec de la création de la candidature: " + error.message);
}
}

export async function getCandidat(id:string){
await connectToDB();
return parseStringify(await Candidature.findById(id));
}

export async function getAllCandidatures() {
await connectToDB();
return parseStringify(await Candidature.find().populate('utilisateurId').populate('electionId').exec());
}

export async function approveCandidature(candidatureId : string) {
await connectToDB();
console.log("candidatureId",candidatureId);

const candidature = await Candidature.findById(candidatureId);
    if (candidature.status === 'accepté' || candidature.status === 'rejeté') {
        throw new Error(`Candidature already ${candidature.status}`);
}
const updatedCandidature = await Candidature.findByIdAndUpdate(
candidatureId,
{ status: 'accepté' },
{ new: true }
);
console.log("updatedCandidature",updatedCandidature);

await Election.findByIdAndUpdate(
updatedCandidature.electionId,
{ $push: { candidats: { id: updatedCandidature._id, nom: updatedCandidature.fullName, programme: updatedCandidature.bio, photo: updatedCandidature.photo } } },
{ new: true }
);

return parseStringify(updatedCandidature);
}

export async function rejectCandidature(candidatureId : string) {
await connectToDB();
const candidature = await Candidature.findById(candidatureId);
    if (candidature.status === 'accepté' || candidature.status === 'rejeté') {
    throw new Error(`Candidature already ${candidature.status}`);
    }
return parseStringify(await Candidature.findByIdAndUpdate(
candidatureId,
{ status: 'rejeté' },
{ new: true }
))
}