"use server";


// lib/actions/election.actions.ts
import { connectToDB } from '../mongoose';
import Election from '../models/election';
import { ElectionProps } from '@/types';
import { parseStringify } from '../utils';
import Candidature from '../models/candidat';
import { sendEmails } from '../nodemailer';
import Utilisateur from '../models/utilisateur';
import { getEligibleUsersForElection } from './user.actions';

export async function createElection(electionData: ElectionProps) {
  await connectToDB();

  try {
    const newElection = new Election({
      titre: electionData.titre,
      dateDebut: electionData.dateDebut,
      dateFin: electionData.dateFin,
      description: electionData.description,
      typeElection: electionData.typeElection,
      classeFormation: electionData.classeFormation,
    });
    await newElection.save();
    // Send emails based on election type
    if (electionData.typeElection === 'école') {
      const users = await Utilisateur.find({status: 'activé'}); // Get all users
      const subject = "Nouvelle élection créée";
      const html = `<div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
          </div>
          <h1 style="text-align: center; color: #4CAF50;">Nouvelle élection créée</h1>
          <p>Bonjour,</p>
          <p>Nous sommes heureux de vous informer qu'une nouvelle élection a été créée.</p>
          <p>En plus d'être un électeur, vous pouvez postuler pour être un candidat.</p>
          <p>Merci de vous connecter à notre application pour plus de détails.</p>
          <ul>
            <li><a href="https://www.votre-site.com/login">Se connecter</a></li>
          </ul>
          <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à tout moment.</p>
          <p>Bonne journée,</p>
          <p>L'équipe de notre application</p>
        </div>`;
      await sendEmails(users, subject, html);
    } else if (electionData.typeElection === 'classe' && electionData.classeFormation) {
      const users = await Utilisateur.find({ classe: electionData.classeFormation }); // Get users of the specific class
      const subject = "Nouvelle élection de classe créée";
      const html = `<div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
          </div>
          <h1 style="text-align: center; color: #4CAF50;">Nouvelle élection de classe créée</h1>
          <p>Bonjour,</p>
          <p>Nous sommes heureux de vous informer qu'une nouvelle élection de classe a été créée.</p>
          <p>Vous êtes un électeur et vous pouvez également postuler pour être un candidat.</p>
          <p>Merci de vous connecter à notre application pour plus de détails.</p>
          <ul>
            <li><a href="https://www.votre-site.com/login">Se connecter</a></li>
          </ul>
          <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à tout moment.</p>
          <p>Bonne journée,</p>
          <p>L'équipe de notre application</p>
        </div>`;
      await sendEmails(users, subject, html);
    }

    return { message: "Élection créée avec succès", type: 'success' };
  } catch (error: any) {
    throw new Error("Échec de la création de l'élection: " + error.message);
  }
}


// export async function createElection(electionData: ElectionProps) {
// await connectToDB();
// try {
// const newElection = new Election({
//     titre: electionData.titre,
//     dateDebut: electionData.dateDebut,
//     dateFin: electionData.dateFin,
//     description: electionData.description,
//     candidats: electionData.candidats,
//     votes: electionData.votes,
//     createAt: Date.now(),
// });

// await newElection.save();
// return { message: "Élection créée avec succès",type:'success'};
// } catch (error: any) {
// throw new Error("Échec de la création de l'élection: " + error.message);
// }
// }

export async function fetchElections(pageNumber = 1, pageSize = 10) {
  await connectToDB();
  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    const electionsQuery = Election.find({ parentId: { $in: [null, undefined] } })
      .sort({ createAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize);

    const totalElectionCount = await Election.countDocuments({ parentId: { $in: [null, undefined] } });
    
    const elections = await electionsQuery.exec();
    const isNext = totalElectionCount > skipAmount + elections.length;

    const currentDate = new Date();

    // Ajouter le statut basé sur les dates
    const electionsWithStatus = elections.map((election: any) => {
      let status = 'à venir'; // Statut par défaut

      if (currentDate > new Date(election.dateFin)) {
        status = 'terminée';
      } else if (currentDate >= new Date(election.dateDebut) && currentDate <= new Date(election.dateFin)) {
        status = 'en cours';
      }

      return {
        ...election._doc,
        status,
        startDate: election.dateDebut.toISOString().split('T')[0],
        endDate: election.dateFin.toISOString().split('T')[0]
      };
    });

    return { elections: parseStringify(electionsWithStatus), isNext };

  } catch (error: any) {
    throw new Error("Failed to fetch elections: " + error.message);
  }
}

export const handleVoteActions = async ({ candidateId, electionId, candidateName, userId }: 
{ candidateId: string, userId: string, electionId: string, candidateName: string }) => {
  try {
    await connectToDB();

    const election = await Election.findById(electionId);
    if (!election) {
      throw new Error('Election not found');
    }

    // Get the list of eligible users for this election
    const eligibleUsers = await getEligibleUsersForElection(electionId);

    // Check if the current user is eligible to vote
    const isEligible = eligibleUsers.some((user: typeof Utilisateur) => user._id.toString() === userId);
    if (!isEligible) {
      return { message: 'Vous n\'êtes pas éligible pour voter dans cette élection', type: 'error' };
    }

    // Check if the user has already voted
    const existingVote = election.votes.find((vote: any) => vote.electeurId.toString() === userId);
    if (existingVote) {
      return { message: 'Vous avez déjà voté pour un candidat', type: 'error' };
    }

    // Register the vote
    election.votes.push({ electeurId: userId, candidatId: candidateId });
    await election.save();

    return { message: `Vous avez voté pour le candidat ${candidateName}`, type: 'success' };
  } catch (error) {
    console.error('Error voting for candidate:', error);
    return { message: 'Erreur lors du vote', type: 'error' };
  }
};
// export const handleVoteActions = async ({candidateId,electionId,candidateName, userId}:{candidateId: string, userId:string,electionId:string,candidateName:string}) => {
//   try {
//     await connectToDB();
//     const election = await Election.findById(electionId);
//     if (!election) {
//       throw new Error('Election not found');
//     }
//     const existingVote = election.votes.find((vote:any) => vote.electeurId.toString() === userId);
//     if (existingVote) {
//       return {message:'Vous avez déjà voté pour un candidat',type:'error'};
//     }
//     election.votes.push({ electeurId: userId, candidatId: candidateId });
//     await election.save();
//     return {message:`Vous avez voté pour le candidat ${candidateName}`,type:'success'};
//   } catch (error) {
//     console.error('Error voting for candidate:', error);
//   }
// };


export const getCandidatesForElection = async (electionId: string) => {
  try {
    await connectToDB();
    
    const election = await Election.findById(electionId).populate('candidats').exec();
    if (!election) {
      console.error(`Élection avec l'ID ${electionId} non trouvée.`);
      return [];
    }

    const approvedCandidates = await Candidature.find({
      _id: { $in: election.candidats },
      status: 'accepté'
    });

    const candidatesWithVotes = approvedCandidates.map(candidate => {
      const candidateVotes = election.votes.filter((vote:any) => vote.candidatId.toString() === candidate._id.toString()).length;
      return {
        ...candidate.toObject(),
        votes: candidateVotes
      };
    });

    return candidatesWithVotes;
  } catch (error) {
    console.error('Erreur lors de la récupération des candidats pour l\'élection:', error);
    return [];
  }
};


export const getElectionById = async (electionId:string) => {
  if (!electionId) {
    throw new Error('ID d\'élection requis');
  }

  try {
    // Utilisez `populate` pour inclure les détails des candidats et des votes
    const election = await Election.findById(electionId)
      .populate('candidats') // Remplacez par le modèle approprié si nécessaire
      .populate('votes.electeurId') // Remplacez par le modèle approprié si nécessaire
      .populate('votes.candidatId'); // Remplacez par le modèle approprié si nécessaire

    if (!election) {
      throw new Error('Élection non trouvée');
    }

    return parseStringify(election);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'élection :', error);
    throw error;
  }
};