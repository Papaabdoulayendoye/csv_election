"use server"
import { CandidatureProps } from '@/types';
import { connectToDB } from '../mongoose';
import Candidature from '../models/candidat';
import Election from '../models/election';
import { parseStringify } from '../utils';
import { sendEmail } from '../nodemailer';
import Utilisateur from '../models/utilisateur';



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
const user = await Utilisateur.findById(candidature.utilisateurId);
  if (!user) {
    throw new Error("User associated with the candidature not found");
  }
const subject = "Votre candidature a été acceptée";
const html = `<div style="font-family: Arial, sans-serif; color: #333;">
    <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
    </div>
    <h1 style="text-align: center; color: #4CAF50;">Félicitations, votre candidature a été acceptée !</h1>
    <p>Bonjour,</p>
    <p>Nous avons le plaisir de vous informer que votre candidature pour l'élection <strong>${election.titre}</strong> a été acceptée.</p>
    <p>Vous êtes désormais candidat pour l'élection à venir. N'hésitez pas à vous connecter à notre application pour suivre l'évolution de votre campagne.</p>
    <ul>
        <li><a href="https://www.votre-site.com/login">Se connecter</a></li>
    </ul>
    <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à tout moment.</p>
    <p>Bonne chance pour l'élection !</p>
    <p>L'équipe de notre application</p>
</div>`;
await sendEmail({to:user.email, subject, html});

return parseStringify(updatedCandidature);
} catch (error) {
console.error("Error approving candidature:", error);
throw error;
}
}










export async function rejectCandidature(candidatureId: string) {
  await connectToDB();

  const candidature = await Candidature.findById(candidatureId);
  if (!candidature) {
    throw new Error("Candidature not found");
  }

  if (candidature.status === 'accepté' || candidature.status === 'rejeté') {
    throw new Error(`Candidature already ${candidature.status}`);
  }

  // Update the status of the candidature to 'rejeté'
  const updatedCandidature = await Candidature.findByIdAndUpdate(
    candidatureId,
    { status: 'rejeté' },
    { new: true }
  );

  if (!updatedCandidature) {
    throw new Error("Failed to update candidature status");
  }

const user = await Utilisateur.findById(candidature.utilisateurId);
    if (!user) {
        throw new Error("User associated with the candidature not found");
    }

  // Send rejection email to the candidate
  const subject = "Votre candidature n'a pas été retenue";
  const html = `<div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
      </div>
      <h1 style="text-align: center; color: #FF5733;">Votre candidature n'a pas été retenue</h1>
      <p>Bonjour ${user.nom},</p>
      <p>Nous regrettons de vous informer que votre candidature pour l'élection n'a pas été retenue.</p>
      <p>Nous vous remercions pour votre intérêt et votre engagement envers cette élection.</p>
      <p>Vous restez bien entendu un électeur pour cette élection et vous pouvez toujours participer au processus de vote.</p>
      <ul>
          <li><a href="https://www.votre-site.com/login">Se connecter</a></li>
      </ul>
      <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à tout moment.</p>
      <p>Bonne journée,</p>
      <p>L'équipe de notre application</p>
  </div>`;

await sendEmail({to:user?.email, subject, html});

  return parseStringify(updatedCandidature);
}