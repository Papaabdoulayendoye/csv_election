// pages/signin.tsx
"use client";

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
import { SignInValidation } from "@/lib/validations/signIn";
import { useRouter } from "next/navigation";
import * as z from 'zod'
import { UserLoginFunction } from '@/lib/actions/user.actions';
import { Loader2 } from 'lucide-react';

const SignIn = () => {
const [submitting, setSubmitting] = useState<boolean>(false);
const router = useRouter();
const form = useForm({
resolver: zodResolver(SignInValidation),
defaultValues: {
    email: '',
    password: '',
},
});

const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
const { email, password } = values;

setSubmitting(true);
try {
    await UserLoginFunction({ email, password });
    localStorage.setItem("currentUser", email);
    setTimeout(() => {
    setSubmitting(false);
    router.push('/dashboard');
    }, 3500);
} catch (error) {
setSubmitting(false);
if (error instanceof Error) {
    form.setError("password", { type: "manual", message: error.message });
}
}
};

return (
<div className="bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <div className="text-center mb-8">
        <svg className="h-12 w-12 text-primary mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="mt-4 text-3xl font-bold text-primary">Connexion à E-Vote</h2>
    </div>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
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
                <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <input type="checkbox" id="remember-me" className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
            </div>
            <div className="text-sm">
            <a href="/forgot-password" className="font-medium text-secondary hover:text-primary">Mot de passe oublié ?</a>
            </div>
        </div>
        <Button type="submit" className="w-full text-white" disabled={submitting}>
            {submitting ? <Loader2 className='animate-spin' /> : 'Se connecter'}
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
        <a href="/sign-up" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-300">
            Créer un nouveau compte
        </a>
        </div>
    </div>
    </div>
</div>
);
};

export default SignIn;
