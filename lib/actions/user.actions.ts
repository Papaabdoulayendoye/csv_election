"use server"
import bcrypt from 'bcrypt';
import Utilisateur from '../models/utilisateur';
import { connectToDB } from '../mongoose';
import { parseStringify } from '../utils';
import Administrateur from '../models/admin';
import { AdministrateurProps } from '@/types';

interface getCurrentUserProps {
    currentUser:string;
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
}

export async function userRegisterFunction({ nom, email, password }: userRegisterFunctionProps) {
    await connectToDB();
    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new Utilisateur({
            nom: nom,
            email: email,
            motDePasse: hashedPassword
        });
        await newUser.save();

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
    const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
    if (!isPasswordValid) {
        throw new Error("Le mot de passe que vous avez entré est incorrect");
    }
    return parseStringify(user);
} else if (admin) {
    if (password !== parseStringify(admin?.motDePasse)) {
        throw new Error("Mot de passe incorrect");
    }
    return parseStringify(admin);
} else {
    throw new Error("Utilisateur ou administrateur non trouvé");
}
} catch (error: any) {
    throw new Error(error.message);
}
}
