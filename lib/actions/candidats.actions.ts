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
try {
const candidature = await Candidature.findById(candidatureId);
if (!candidature) {
    throw new Error('Candidature not found');
}

if (candidature.status === 'accepté' || candidature.status === 'rejeté') {
    throw new Error(`Candidature already ${candidature.status}`);
}
candidature.status = 'accepté';
candidature.votes = [];
const updatedCandidature = await candidature.save();

const election = await Election.findByIdAndUpdate(
    updatedCandidature.electionId,
    { 
    $push: { 
        candidats: { 
        _id: updatedCandidature._id, 
        fullName: updatedCandidature.fullName, 
        bio: updatedCandidature.bio, 
        photo: updatedCandidature.photo
        } 
    } 
    },
    { new: true }
);

if (!election) {
    throw new Error('Election not found');
}
return parseStringify(updatedCandidature);
} catch (error) {
console.error("Error approving candidature:", error);
throw error;
}
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