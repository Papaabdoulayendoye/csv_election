// pages/postuler.tsx
"use client";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostulerValidation } from '@/lib/validations/candidature';
import { createCandidature } from '@/lib/actions/candidats.actions'; // Adjust the import as needed
import { getCurrentUserActions,getEligibleUsersForElection } from '@/lib/actions/user.actions';
import { toast } from 'react-toastify';
import { getElectionById } from '@/lib/actions/election.actions';

const Postuler = ({ params }: { params: { id: string } }) => {
    const electionId = params.id;

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [user, setUser] = useState<{ _id: string } | null>(null);
    const [election, setElection] = useState<{ _id: string,titre:string } | null>(null);
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(PostulerValidation),
        defaultValues: {
            election: '',
            fullName: '',
            email: '',
            phone: '',
            bio: '',
            photo: ''
        },
    });

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            router.push('/');
        } else {
            const getUser = async () => {
                const response = await getCurrentUserActions({ currentUser });
                setUser(response);
            };
            const currentELection = async () => {
                const response = await getElectionById(electionId)
                setElection(response)
            }
            getUser();
            currentELection();
        }
    }, [router]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                form.setValue("photo", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof PostulerValidation>) => {
        setSubmitting(true);
        const { bio, email, fullName, phone, photo } = values;

        const formData = new FormData();
        formData.append("electionId", electionId);
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phone", phone || '');
        formData.append("bio", bio);
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            if (!user) {
                throw new Error("Utilisateur non connecté.");
            }
            const eligibleUsers = await getEligibleUsersForElection(electionId);
            const isEligible = eligibleUsers.some((eligibleUser: any) => eligibleUser._id.toString() === user._id.toString());
            if (!isEligible) {
                toast.error("Vous n'êtes pas éligible pour cette élection.");
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
                throw new Error("Vous n'êtes pas éligible pour cette élection.");
            }
            await createCandidature({
                utilisateurId: user._id,
                electionId,
                fullName,
                email,
                phone,
                bio,
                photo,
            });
        setSubmitting(false);
        setShowConfirmation(true);
        form.reset();
        setPhotoPreview(null);
        setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
        } catch (error) {
            console.error("Erreur lors de la soumission de la candidature :", error);
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Application de Candidat</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">{election?.titre}</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Formulaire de Candidature</h2>

                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom Complet :</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse Email :</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Numéro de Téléphone :</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brève Biographie ou Déclaration d’Intention :</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={4} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photo de Profil (optionnelle) :</FormLabel>
                                <FormControl>
                                    <Input
                                        onChange={handlePhotoChange}
                                        type='file'
                                        accept='image/jpg, image/png, image/jpeg'
                                    />
                                </FormControl>
                                {photoPreview && (
                                    <Image src={photoPreview} width={20} height={20} alt="Prévisualisation de la photo" className="mt-2 h-20 w-20 object-cover" />
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={submitting}>
                            {submitting ? <Loader2 className='animate-spin' /> : 'Soumettre la Candidature'}
                        </Button>
                        <Button type="button" onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                            Annuler
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Modal de Confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Candidature Soumise !</h2>
                        <p className="text-gray-700 mb-4">Merci d'avoir soumis votre candidature. Nous l'avons reçue et nous l'examinerons sous peu.</p>
                        <p className="text-gray-700 mb-4">Statut de votre candidature : <span className="font-semibold text-blue-600">En Attente de Révision</span></p>
                        <Button onClick={() => {
                            setShowConfirmation(false);
                            router.back();
                        }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Fermer
                        </Button>
                    </div>
                </div>
            )}

            {/* Superposition de Chargement */}
            {submitting && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="custom-loader"></div>
                </div>
            )}
        </div>
    );
};

export default Postuler;
