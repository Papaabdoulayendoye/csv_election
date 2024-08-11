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
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


export default function CreateElection() {
  const currentUser = localStorage.getItem('currentUser');
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(ElectionValidation),
    defaultValues: {
      titre: '',
      description: '',
      typeElection: 'école',
      classeFormation: '',
      dateDebut: '',
      dateFin: '',
    },
  });

  const { handleSubmit, control,reset,watch } = form;
  const typeElection = watch('typeElection');
  const onSubmit = async (values: z.infer<typeof ElectionValidation>) => {
    // Envoi des données au serveur ou sauvegarde locale
    setSubmitting(true);
try {
    const response = await createElection(values);
    if (response.type === 'success') {
      toast.success(response.message);
      setTimeout(() => {
      setSubmitting(false);
      router.push('/dashboard');
      }, 3500);
      return;
    }
} catch (error) {
    setSubmitting(false);
    console.error(error);
}
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
  if (currentUser !== 'admin.evote@gmail.com') {
    router.push('/dashboard');
  }
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
                  <FormMessage className='text-red-500'/>
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
                  <FormMessage className='text-red-500'/>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="typeElection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'élection</FormLabel>
                  <FormControl>
                    <select
                      className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      {...field}
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="classe">Classe</option>
                      <option value="école">École</option>
                    </select>
                  </FormControl>
                  <FormMessage className='text-red-500'/>
                </FormItem>
              )}
            />
            {typeElection === 'classe' && (
              <FormField
                control={control}
                name="classeFormation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe et Formation</FormLabel>
                    <FormControl>
                      <select
                        className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...field}
                      >
                        <option value="">Sélectionnez la classe et la formation</option>
                        <option value="L1 GLAR">L1 GLAR</option>
                        <option value="L2 GLAR">L2 GLAR</option>
                        <option value="L3 GLAR">L3 GLAR</option>
                        <option value="L1 RT">L1 RT</option>
                        <option value="L2 RT">L2 RT</option>
                        <option value="L3 RT">L3 RT</option>
                        <option value="L1 GEER">L1 GEER</option>
                        <option value="L2 GEER">L2 GEER</option>
                        <option value="L3 GEER">L3 GEER</option>
                        <option value="L1 IM">L1 IM</option>
                        <option value="L2 IM">L2 IM</option>
                        <option value="L3 IM">L3 IM</option>
                      </select>
                    </FormControl>
                    <FormMessage className='text-red-500'/>
                  </FormItem>
                )}
              />
            )}
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
                      <FormMessage className='text-red-500'/>
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
                      <FormMessage className='text-red-500'/>
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
