"use server"
import bcrypt from 'bcrypt';
import Utilisateur from '../models/utilisateur';
import { connectToDB } from '../mongoose';
import { parseStringify } from '../utils';
import Administrateur from '../models/admin';
import { AdministrateurProps } from '@/types';
import { sendEmail } from '../nodemailer';
import Election from '../models/election';

interface getCurrentUserProps {
    currentUser:string;
}


export async function getAllUsers({ page = 1, limit = 10 }: { page: number; limit: number }) {
  await connectToDB();
  const skip = (page - 1) * limit;
  const [users, totalUsers] = await Promise.all([
    Utilisateur.find().skip(skip).limit(limit).exec(),
    Utilisateur.countDocuments().exec()
  ]);
  return {
    users: parseStringify(users),
    totalUsers,
  };
}

export async function activateUser({id,email}: {id:string,email:string}) {
  await connectToDB();
  await Utilisateur.findByIdAndUpdate(id, { status: 'activé' });
  const html = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
  </div>
  <h1 style="text-align: center; color: #4CAF50;">Votre compte a été activé</h1>
  <p>Bonjour,</p>
  <p>Nous sommes heureux de vous informer que votre compte sur notre application a été activé par notre administrateur.</p>
  <p>Vous pouvez maintenant vous connecter et commencer à utiliser nos services :</p>
  <ul>
    <li><a href="https://www.votre-site.com/login">Se connecter</a></li>
  </ul>
  <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à tout moment.</p>
  <p>Bonne journée,</p>
  <p>L'équipe de notre application</p>
</div>
`;
await sendEmail({to:email, subject : "Votre compte a été activé",html:html})
}

export async function deactivateUser(id: string) {
  await connectToDB();
  await Utilisateur.findByIdAndUpdate(id, { status: 'desactivé' });
}

export async function getCurrentUserActions({ currentUser }: getCurrentUserProps) {
await connectToDB();

try {
const user = await Utilisateur.findOne({ email: currentUser });
const admin = await Administrateur.findOne({ email: currentUser });

if (user) {
    return parseStringify(user);
} else if (admin) {
    return parseStringify(admin);
} else {
    throw new Error("Utilisateur ou administrateur non trouvé");
}
} catch (error: any) {
throw new Error("Échec de la récupération de l'utilisateur actuel: " + error.message);
}
}


interface userRegisterFunctionProps {
    nom: string; 
    email: string; 
    password: string ;
    formation: string;
    classe:string;
    // classeFormation?: string;
}

export async function userRegisterFunction({ nom, email, password,formation,classe }: userRegisterFunctionProps) {
await connectToDB();
try {
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new Utilisateur({
        nom: nom,
        email: email,
        motDePasse: hashedPassword,
        formation:formation,
        classe:`${classe} ${formation}`
    });
    await newUser.save();
const html = `
<div style="font-family: Arial, sans-serif; color: #333;">
<div style="text-align: center; margin-bottom: 20px;">
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHeqCARPNAbZnvG5C2AZnA7mLWrR8rO2_30Q&s" alt="Logo de notre application" style="width: 100px; height: auto;">
</div>
<h1 style="text-align: center; color: #4CAF50;">Bienvenue sur notre application</h1>
<p>Bonjour ${nom},</p>
<p>Merci de vous être inscrit sur notre application ! Nous sommes ravis de vous avoir parmi nous.</p>
<p>Votre compte est actuellement en attente d'activation. Il sera actif dès que l'administrateur aura validé votre inscription.</p>
<p>Voici quelques ressources pour vous aider à démarrer :</p>
<ul>
<li><a href="https://www.votre-site.com/guide-de-demarrage">Guide de démarrage</a></li>
<li><a href="https://www.votre-site.com/faq">FAQ</a></li>
<li><a href="https://www.votre-site.com/support">Support</a></li>
</ul>
<p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à tout moment.</p>
<p>Bonne journée,</p>
<p>L'équipe de notre application</p>
<div style="text-align: center; margin-top: 20px;">
<a href="https://www.votre-site.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visitez notre site</a>
</div>
</div>
`;
await sendEmail({to:email, subject : "Bienvenue sur notre application",html:html})
console.log("Utilisateur ajouté avec succès");
} catch (error: any) {
console.log("Échec de l'ajout de l'utilisateur : " + error.message);
}
}
interface UserLoginFunctionProps {
    email : string;
    password:string;
}

export async function UserLoginFunction({ email, password }: UserLoginFunctionProps) {
await connectToDB();
try {
const user = await Utilisateur.findOne({ email });
const admin = await Administrateur.findOne({ email }) as AdministrateurProps;

if (user) {
    if (user.status=== "activé") {
      const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
      if (!isPasswordValid) {
          throw new Error("Le mot de passe que vous avez entré est incorrect");
      }
      return parseStringify(user);
    }else{
      throw new Error("Votre Utilisateur n'est pas activé");
    }
    
  }else if(admin)
  {
      if (password !== parseStringify(admin?.motDePasse)) {
          throw new Error("Mot de passe incorrect");
      }
      return parseStringify(admin);
  }
  else
  {
    throw new Error("Cette Utilisateur n'existe pas");
  }
}catch (error: any) {
      throw new Error(error.message);
  }
}


// Dans lib/actions/user.actions.ts

export const updateUserProfile = async (data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  bio: string;
}) => {
  // Logique pour mettre à jour le profil utilisateur dans la base de données
  // Exemple:
  const response = await fetch('/api/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du profil');
  }

  return await response.json();
};





export const  getEligibleUsersForElection= async (electionId: string): Promise<typeof Utilisateur[]> =>{
  // Récupérer les informations de l'élection
  const election = await Election.findById(electionId);
  if (!election) {
    throw new Error('Élection non trouvée');
  }
  if (election.typeElection === 'école') {
    // Tous les utilisateurs activés sont éligibles
    return parseStringify(await Utilisateur.find({ status: 'activé' }));
  } else if (election.typeElection === 'classe' && election.classeFormation) {
    // Seuls les utilisateurs de la même classe sont éligibles
    return parseStringify(await Utilisateur.find({ status: 'activé', classe: election.classeFormation }));
  }
  return [];
}