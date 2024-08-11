"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input} from "@/components/ui/input";
import {  Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from 'zod';
import { getCurrentUserActions, updateUserProfile } from '@/lib/actions/user.actions'; // Ajoutez cette ligne
import { Loader2 } from 'lucide-react';
import { UserProps } from '@/types';

const UserProfileValidation = z.object({
  nom: z.string().nonempty("Le nom complet est requis"),
  email: z.string().email("Adresse courriel invalide").nonempty("L'adresse courriel est requise"),
  phoneNumber: z.string().nonempty("Le numéro de téléphone est requis"),
  bio: z.string().optional(),
});

const UserProfile: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const [user, setUser] = useState<UserProps>();

  const form = useForm({
    resolver: zodResolver(UserProfileValidation),
    defaultValues: {
      nom: '',
      email: '',
      phoneNumber: '',
      bio: '',
    },
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push('/sign-in');
    } else {
      const getCurrentUser = async () => {
        const response = await getCurrentUserActions({ currentUser });
        setUser(response);
        form.reset({
          nom: response.nom,
          email: response.email,
          phoneNumber: response.phoneNumber,
          bio: response.bio,
        });
      };
      getCurrentUser();
    }
  }, [router, form]);

  const onSubmit = async (values: z.infer<typeof UserProfileValidation>) => {
    setSubmitting(true);
    try {
      // Logique pour mettre à jour le profil utilisateur
    //   await updateUserProfile(values); // Ajoutez cette ligne pour mettre à jour le profil
    console.log("Values",values);
    
      setSubmitting(false);
      alert("Profil mis à jour avec succès");
    } catch (error) {
      setSubmitting(false);
      if (error instanceof Error) {
        form.setError("email", { type: "manual", message: error.message });
      }
    }
  };

  const votingHistory = [
    {
      name: 'Élection du conseil municipal 2022',
      date: '8 novembre 2022',
      voted: true,
    },
    {
      name: 'Élection du conseil scolaire 2021',
      date: '14 septembre 2021',
      voted: true,
    },
  ];

  return (
    <section className='h-full w-full bg-gray-100'>
        <Navbar user={user!} />
        <h1 className="text-3xl font-bold mt-8 container">Votre profile</h1>
        <div className="container mt-8 p-4 min-h-screen">
            <div className='bg-white p-4 rounded-md shadow-md relative'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
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
                  <FormLabel>Adresse courriel</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                    <Input type="text" {...field}  />
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
                  <FormLabel>Biographie</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
            <Button type="submit" className="text-white" size={'lg'} disabled={submitting}>
              {submitting ? <Loader2 className='animate-spin' /> : 'Modifier le profil'}
            </Button>
            </div>
          </form>
        </Form>
            </div>

        <div className="voting-history p-4 bg-white rounded-md shadow-md mt-8">
          <h2 className="text-xl font-bold mb-4">Historique de vote</h2>
          {votingHistory.map((election) => (
            <div key={election.name} className="election mb-3">
              <h3 className="text-lg font-bold mb-2">{election.name}</h3>
              <p className="text-gray-600">
                <span className="date">{election.date}</span>{' '}
                {election.voted ? (
                  <span className="voted text-green-500 font-bold">
                    <i className="fas fa-check-circle" /> Vote enregistré
                  </span>
                ) : (
                  <span className="not-voted text-red-500 font-bold">
                    <i className="fas fa-times-circle" /> Non voté
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
