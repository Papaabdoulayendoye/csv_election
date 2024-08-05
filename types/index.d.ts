// types.ts

import { Types } from "mongoose";

interface Vote {
electionId: Types.ObjectId;
candidatId: Types.ObjectId;
}

interface CandidatureProps2 {
electionId: Types.ObjectId;
status: string; // Ex: "accepté", "rejeté", "en attente"
}

export interface UserProps {
  _id: string;
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  bio: string;
  photo?: string;
  status: 'activé' | 'desactivé';
  votes: Vote[];
  candidatures: Candidature[];
  createdAt: Date;
}

export interface CandidatProps {
nom: string;
programme: string;
photo?: string;
}


export interface ElectionCandidat {
id: Types.ObjectId;
nom: string;
programme: string;
photo?: string;
}

export interface ElectionVote {
electeurId: Types.ObjectId;
candidatId: Types.ObjectId;
}



export interface AdministrateurProps {
nom: string;
email: string;
motDePasse: string;
}

export interface CreateElectionProps {
    titre: string;
    dateDebut: Date;
    dateFin: Date;
    description: string;
    candidats: Array<{ id: string; nom: string; programme: string; photo?: string }>;
}



export interface ElectionProps {
titre: string;
dateDebut: string;
dateFin: string;
description: string;
category:string;
candidats?: ElectionCandidat[];
votes?: ElectionVote[];
}

// export interface ElectionProps {
//   titre: string;
//   dateDebut: Date;
//   dateFin: Date;
//   description: string;
//   candidats: Array<{
//     id: string;
//     nom: string;
//     programme: string;
//     photo?: string;
//   }>;
//   votes: Array<{
//     electeurId: string;
//     candidatId: string;
//   }>;
// }


interface CandidatureProps {
  utilisateurId: string;
  electionId: string;
  fullName: string;
  email: string;
  phone?: string;
  bio: string;
  photo?: string | File | undefined;
}

export interface CandidatureProps3 {
  _id: string;
  utilisateurId: string;
  electionId: ElectionProps;
  fullName: string;
  email: string;
  phone?: string;
  bio: string;
  photo?: string;
  status: 'en attente' | 'accepté' | 'rejeté';
  createdAt: string;
}