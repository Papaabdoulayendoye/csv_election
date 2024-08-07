"use client";
// pages/register.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as z from 'zod'
import { RegisterValidation } from "@/lib/validations/register";
import { usePathname, useRouter } from "next/navigation";
import { userRegisterFunction } from '@/lib/actions/user.actions';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const pathName = usePathname()
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      nom: '',
      email: '',
      formation: '',
      classe: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterValidation>) => {
    setSubmitting(true);
    const {nom,email,password} = values;
    try {
        await userRegisterFunction({nom,email,password});
      setTimeout(() => {
        setSubmitting(false);
        router.push('/sign-in');
      }, 3500);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <svg className="h-12 w-12 text-primary mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="mt-4 text-3xl font-bold text-primary">Créer un compte E-Vote</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prenom & Nom</FormLabel>
                  <FormControl>
                    <Input type="nom" {...field} placeholder='John Doe' />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder='john.doe@gmail.com'/>
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation</FormLabel>
                    <Select>
                  <FormControl>
      <SelectTrigger >
        <SelectValue placeholder="Choisi ta formation" />
      </SelectTrigger>
                  </FormControl>
      <SelectContent>
        <SelectGroup className='bg-gray-300'>
          <SelectItem value='GLAR'>GLAR (Génie logiciel et Réseaux)</SelectItem>
                <SelectItem value='RT'>RT (Télécommunication - Réseaux)</SelectItem>
                <SelectItem value='GEER'>GEER (Génie électrique et Energies renouvelables)</SelectItem>
                <SelectItem value='IM'>IM (Informatique et Multimédia)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                    <Select {...field}>
                  <FormControl>
      <SelectTrigger className="">
        <SelectValue placeholder="Choisi ta classe" />
      </SelectTrigger>
        </FormControl>
      <SelectContent>
        <SelectGroup className='bg-gray-300'>
          <SelectItem value='L1'>L1 (Licence 1)</SelectItem>
          <SelectItem value='L2'>L2 (Licence 2)</SelectItem>
          <SelectItem value='L3'>L3 (Licence 3)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder='******' />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder='******' />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-white" disabled={submitting}>
              {submitting ? <Loader2 className='text-white animate-spin' /> : 'Créer un compte'}
            </Button>
          </form>
        </Form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>
          <div className="mt-6">
            <a href="/sign-in" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-300">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
