"use server";


// lib/actions/election.actions.ts
import { connectToDB } from '../mongoose';
import Election from '../models/election';
import { ElectionProps } from '@/types';
import { parseStringify } from '../utils';

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



// export async function fetchElections(pageNumber = 1, pageSize = 20) {
//     await connectToDB();
//     const skipAmount = (pageNumber - 1) * pageSize
    
//     try 
//     {
        
//         const ElectionsQuery = Election.find({ parentId : {$in :[ null, undefined ]}}).sort({createAt : 'desc'}).skip(skipAmount).limit(pageSize);
        
//         const totalELectionCount = await Election.countDocuments({parentId : {$in :[ null, undefined ]}})
        
//         const Elections = await ElectionsQuery.exec();
//         const isNext = totalELectionCount > skipAmount + Elections.length;
        
//         return parseStringify(Elections);
//         // return {Elections, isNext}
        
//     }catch (error : any) {
//         throw new Error("Failed to fetch threads",error.message)
//     }
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
