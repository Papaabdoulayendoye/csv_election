"use server";


// lib/actions/election.actions.ts
import { connectToDB } from '../mongoose';
import Election from '../models/election';
import { ElectionProps } from '@/types';
import { parseStringify } from '../utils';
import Candidature from '../models/candidat';

export async function createElection(electionData: ElectionProps) {
await connectToDB();
try {
const newElection = new Election({
    titre: electionData.titre,
    dateDebut: electionData.dateDebut,
    dateFin: electionData.dateFin,
    description: electionData.description,
    candidats: electionData.candidats,
    votes: electionData.votes,
    createAt: Date.now(),
});

await newElection.save();
return { message: "Élection créée avec succès" };
} catch (error: any) {
throw new Error("Échec de la création de l'élection: " + error.message);
}
}

export async function fetchElections(pageNumber = 1, pageSize = 20) {
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

export const handleVoteActions = async ({candidateId,electionId, userId}:{candidateId: string, userId:string,electionId:string}) => {
  try {
    await connectToDB();
    console.log("electionId", electionId);
    console.log("candidateId", candidateId);
    console.log("userId", userId);
    const election = await Election.findById(electionId);
    if (!election) {
      throw new Error('Election not found');
    }
    const existingVote = election.votes.find((vote:any) => vote.electeurId.toString() === userId);
    if (existingVote) {
      throw new Error('Vous avez déjà voté');
    }
    election.votes.push({ electeurId: userId, candidatId: candidateId });
    await election.save();
    console.log("Vote enregistré avec succès !");
  } catch (error) {
    console.error('Error voting for candidate:', error);
  }
};


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