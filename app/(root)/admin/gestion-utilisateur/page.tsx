"use client"
import React,{useState, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { StatCard } from '@/components/StatCard';
import { cn } from '@/lib/utils';
import {useRouter} from "next/navigation";
import { UserProps } from '@/types';
import { activateUser, deactivateUser, getAllUsers } from '@/lib/actions/user.actions';
import {
Table,
TableBody,
TableCaption,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import clsx from 'clsx';

const AdminUsers = () => {
const [users, setUsers] = useState<UserProps[]>([]);
const [loading, setLoading] = useState(true);
const router = useRouter();
useEffect(() => {
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
router.push('/sign-in');
} else {
const fetchUsers = async () => {
    const response = await getAllUsers();
    setUsers(response);
    setLoading(false);
};
fetchUsers();
}
}, [router]);

const handleActivate = async (id: string) => {
await activateUser(id);
window.location.reload();
};

const handleDeactivate = async (id: string) => {
await deactivateUser(id);
window.location.reload();
};

    if (loading) {
return <p className="text-white">Chargement...</p>;
}
const getStatusColor = (status: string) => {
    switch (status) {
    case "activé":
        return "text-green-500";
    case "desactivé":
        return "text-red-500";
    default:
        return "text-gray-500";
    }
};
const totalUsers = users.length;
const activeUsers = users.filter(u => u.status === 'activé').length;
const inactiveUsers = users.filter(u => u.status === 'desactivé').length;
return (
<>
<div className={cn(
    "min-h-screen bg-dark-300 font-sans antialiased flex-col space-y-14"
    
    )} >
    <header className="admin-header">
    <Link href="/" className="cursor-pointer">
        <div className="flex items-center">
        <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-bold text-xl">E-Vote Admin</span>
    </div>
    </Link>
    <p className="text-16-semibold">Admin Dashboard</p>
    </header>
<main className="admin-main">
    <section className="w-full space-y-4">
        <h1 className="header text-white">Bienvenue 👋</h1>
        <p className="text-dark-700">
        Gestion des utilisateurs
        </p>
    </section>

    <section className="admin-stat">
        <StatCard
        type="appointments"
        count={totalUsers}
        label="Total Utilisateur"
        icon={"/assets/icons/appointments.svg"}
        />
        <StatCard
        type="pending"
        count={activeUsers}
        label="Activé"
        icon={"/assets/icons/pending.svg"}
        />
        <StatCard
        type="cancelled"
        count={inactiveUsers}
        label="Desactivé"
        icon={"/assets/icons/cancelled.svg"}
        />
    </section>
    <div className="container overflow-x-auto bg-gray-800 rounded-lg p-6">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="text-white py-2 px-4">Nom</TableHead>
            <TableHead className="text-white py-2 px-4">Email</TableHead>
            <TableHead className="text-white py-2 px-4">Téléphone</TableHead>
            <TableHead className="text-white py-2 px-4">Bio</TableHead>
            <TableHead className="text-white py-2 px-4">Photo</TableHead>
            <TableHead className="text-white py-2 px-4">Statut</TableHead>
            <TableHead className="text-white py-2 px-4">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map((user) => (
            <TableRow key={user._id} className="border-t border-gray-700">
                <TableCell className="py-2 px-4 text-white">{user.nom}</TableCell>
                <TableCell className="py-2 px-4 text-white">{user.email}</TableCell>
                <TableCell className="py-2 px-4 text-white">{user.telephone || 'N/A'}</TableCell>
                <TableCell className="py-2 px-4 text-white">{user.bio || 'N/A'}</TableCell>
                <TableCell className="py-2 px-4 text-white">
                {user.photo ? (
                    <Image src={user.photo} alt={user.nom} width={50} height={50} />
                ) : (
                    'N/A'
                )}
                </TableCell>
                <TableCell className="py-2 px-4 text-white">
                <div className={clsx("status-badge", {
                                "bg-green-600": user.status === "activé",
                                "bg-red-600": user.status === "desactivé",
                                    })}>
                <p className={clsx("text-12-semibold capitalize", {
                        "text-green-500": user.status === "activé",
                        "text-red-500": user.status === "desactivé",
                })}>
                {user.status}
                </p>
                </div>
            </TableCell>
            <TableCell className="py-2 px-4">
                {user.status === 'desactivé' ? (
                <button
                    onClick={() => handleActivate(user._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
                    >
                    Activer
                    </button>
                ) : (
                    <button
                    onClick={() => handleDeactivate(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                    >
                    Désactiver
                    </button>
                )}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
    </main>
</div>
</>
);
};

export default AdminUsers;
