"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { StatCard } from '@/components/StatCard';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push('/sign-in');
    } else {
      const fetchUsers = async () => {
        const { users, totalUsers } = await getAllUsers({ page: currentPage, limit: itemsPerPage });
        setUsers(users);
        setTotalUsers(totalUsers);
        setLoading(false);
      };
      fetchUsers();
    }
  }, [router, currentPage, itemsPerPage]);

  const handleActivate = async ({ id, email }: { id: string, email: string }) => {
    await activateUser({ id, email });
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
        return "text-blue-500";
    }
  };

  const activeUsers = users.filter(u => u.status === 'activé').length;
  const pendingUsers = users.filter(u => u.status === 'en attente').length;
  const inactiveUsers = users.filter(u => u.status === 'desactivé').length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  console.log('====================================');
  console.log("users",users);
  console.log('====================================');
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={cn("min-h-screen bg-dark-300 font-sans antialiased flex-col space-y-14")}>
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
            <p className="text-dark-700">Gestion des utilisateurs</p>
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
              count={pendingUsers}
              label="En Attente"
              icon={"/assets/icons/pending.svg"}
            />
            <StatCard
              type="pending"
              count={activeUsers}
              label="Activé"
              icon={"/assets/icons/pending.svg"}
              icons={true}
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
                  {/* <TableHead className="text-white py-2 px-4">Téléphone</TableHead>
                  <TableHead className="text-white py-2 px-4">Bio</TableHead> */}
                  <TableHead className="text-white py-2 px-4">Formation</TableHead>
                  <TableHead className="text-white py-2 px-4">Classe</TableHead>
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
                    <TableCell className="py-2 px-4 text-white">{user.formation}</TableCell>
                    <TableCell className="py-2 px-4 text-white">{user.classe}</TableCell>
                    {/* <TableCell className="py-2 px-4 text-white">{user.telephone || 'N/A'}</TableCell>
                    <TableCell className="py-2 px-4 text-white">{user.bio || 'N/A'}</TableCell> */}
                    <TableCell className="py-2 px-4 text-white">
                      {user.photo ? (
                        <Image src={user.photo} alt={user.nom} width={50} height={50} />
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-white">
                      <div className={clsx("status-badge", {
                        "bg-blue-600": user.status === "en attente",
                        "bg-green-600": user.status === "activé",
                        "bg-red-600": user.status === "desactivé",
                      })}>
                        <p className={clsx("text-12-semibold capitalize", {
                          "text-blue-500": user.status === "en attente",
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
                          onClick={() => handleActivate({ id: user._id, email: user.email })}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
                        >
                          Activer
                        </button>
                      ) : user.status === 'en attente' ? (
                        <button
                          onClick={() => handleActivate({ id: user._id, email: user.email })}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
                        >
                          Activer
                        </button>
                      ): (
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
            <Pagination className='mb-8 mt-4'>
              <PaginationContent>
                <Button className='text-white' disabled={currentPage === 1}>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  
                >
                  Précédent
                </PaginationPrevious>
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>

                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <Button className='text-white' disabled={currentPage === totalPages}>
                <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                >
                Suivant
                </PaginationNext>
                </Button>
            </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminUsers;
