"use client"
import { useState, useEffect } from 'react';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import * as z from 'zod';
import { ElectionValidation } from '@/lib/validations/eclection';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { createElection } from '@/lib/actions/election.actions';
import { Loader2 } from 'lucide-react';
import { ElectionProps } from '@/types';
import { useRouter } from 'next/navigation';

export default function CreateElection() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(ElectionValidation),
    defaultValues: {
      titre: '',
      description: '',
      category: '',
      dateDebut: '',
      dateFin: '',
    },
  });

  const { handleSubmit, control,reset } = form;

  const onSubmit = async (values: z.infer<typeof ElectionValidation>) => {
    // Envoi des données au serveur ou sauvegarde locale
    setSubmitting(true);
try {
    await createElection(values);
    setTimeout(() => {
    setSubmitting(false);
    router.push('/dashboard');
    }, 3500);
} catch (error) {
    setSubmitting(false);
    console.error(error);
}
    // console.log('Données de l\'élection:', values);

  };

  const initializeDatePickers = () => {
    flatpickr("#start-date", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      onChange: (selectedDates, dateStr) => {
        form.setValue('dateDebut', dateStr);
      },
    });

    flatpickr("#end-date", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      onChange: (selectedDates, dateStr) => {
        form.setValue('dateFin', dateStr);
      },
    });
  };

  useEffect(() => {
    initializeDatePickers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/dashboard" className="text-2xl font-bold">E-Vote Admin</a>
          <div className="space-x-4">
            <a href="/dashboard" className="hover:text-secondary transition duration-300">Tableau de bord</a>
            <a href="/#" className="hover:text-secondary transition duration-300">Élections</a>
            <a href="/sign-in" className="hover:text-secondary transition duration-300">Déconnexion</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Créer une nouvelle élection</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-6">
            <FormField
              control={control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'élection</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Entrez le titre de l'élection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Entrez la description de l'élection"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...field}>
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="local">Locale</option>
                      <option value="state">Régionale</option>
                      <option value="national">Nationale</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <FormField
                  control={control}
                  name="dateDebut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Sélectionnez la date de début" id="start-date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={control}
                  name="dateFin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Sélectionnez la date de fin" id="end-date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                type="button"
                onClick={() => {}}
              >
                Enregistrer comme brouillon
              </Button>
              <Button
                className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                type="submit"
              >
                {submitting ? <Loader2 className='animate-spin' /> : 'Créer l\'élection'}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
