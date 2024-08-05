"use client";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { getAllCandidatures, approveCandidature, rejectCandidature, getCandidat } from '@/lib/actions/candidats.actions';
import { useRouter } from 'next/navigation';
import 'tailwindcss/tailwind.css';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidatureProps3, UserProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUserActions } from '@/lib/actions/user.actions';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/StatCard';
import clsx from 'clsx';

const AdminCandidatures = () => {
  const [candidatures, setCandidatures] = useState<CandidatureProps3[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProps>();
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push('/sign-in');
    } else {
      const getCurrentUser = async () => {
        const response = await getCurrentUserActions({currentUser});
        setUser(response);
      };
      getCurrentUser();
    }
  }, [router]);

  useEffect(() => {
    const fetchCandidatures = async () => {
      const response = await getAllCandidatures();
      setCandidatures(response);
      setLoading(false);
    };
    fetchCandidatures();
  }, []);
  
  const handleApprove = async (id: string) => {
    const candidature = await getCandidat(id);
    if (candidature.status === 'accepté') {
    toast.error('Ce candidat a déjà été approuvé.');
    return;
    }
    await approveCandidature(id);
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    const candidature = await getCandidat(id);
    if (candidature.status === 'accepté') {
    await rejectCandidature(id);
    toast.success('Ce candidat vient d\'etre rejeté.');
    return;
    }
    window.location.reload();
  };

  const loggout = () => {
    localStorage.clear();
  };

  const getBgStatusColor = (status: string) => {
    switch (status) {
      case "en attente":
        return "bg-blue-600";
      case "accepté":
        return "bg-green-600";
      case "rejeté":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };


  if (loading) {
    return <p className="text-white">Chargement...</p>;
  }

  const totalCandidatures = candidatures.length;
  const pendingCandidatures = candidatures.filter(c => c.status === 'en attente').length;
  const acceptedCandidatures = candidatures.filter(c => c.status === 'accepté').length;
  const rejectedCandidatures = candidatures.filter(c => c.status === 'rejeté').length;

  return (
    <div className={cn(
    "min-h-screen bg-dark-300 font-sans antialiased flex-col space-y-14"
    )}>
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
        Gestion des Candidatures
        </p>
        </section>
        <section className="admin-stat">
        <StatCard
        type="appointments"
        count={totalCandidatures}
        label="Total Candidatures"
        icon={"/assets/icons/appointments.svg"}
        />
        <StatCard
        type="pending"
        count={pendingCandidatures}
        label="En Attente"
        icon={"/assets/icons/pending.svg"}
        />
        <StatCard
        type="pending"
        count={acceptedCandidatures}
        label="Acceptées"
        icon={"/assets/icons/pending.svg"}
        icons={true}
        />
        <StatCard
        type="cancelled"
        count={rejectedCandidatures}
        label="Rejetées"
        icon={"/assets/icons/cancelled.svg"}
        />
    </section>
        <div className=" container overflow-x-auto bg-gray-800 rounded-lg p-6">
          <Table>
            <TableCaption className='text-white'>Liste des candidatures récentes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white py-2 px-4">Nom complet</TableHead>
                <TableHead className="text-white py-2 px-4">Email</TableHead>
                <TableHead className="text-white py-2 px-4">Téléphone</TableHead>
                <TableHead className="text-white py-2 px-4">Bio</TableHead>
                <TableHead className="text-white py-2 px-4">Photo</TableHead>
                <TableHead className="text-white py-2 px-4">Statut</TableHead>
                <TableHead className="text-white py-2 px-4">Élection</TableHead>
                <TableHead className="text-white py-2 px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidatures.map((candidature) => (
                <TableRow key={candidature._id} className="border-t border-gray-700">
                  <TableCell className="py-2 px-4 text-white">{candidature.fullName}</TableCell>
                  <TableCell className="py-2 px-4 text-white">{candidature.email}</TableCell>
                  <TableCell className="py-2 px-4 text-white">{candidature.phone || 'N/A'}</TableCell>
                  <TableCell className="py-2 px-4 text-white">{candidature.bio}</TableCell>
                  <TableCell className="py-2 px-4 text-white">
                    <div className='h-[60px] w-[60px] rounded-full'>
                    {candidature.photo ? (
                      <Image src={candidature.photo} alt={candidature.fullName} className='h-[60px] w-[60px] rounded-full bg-contain bg-no-repeat'  width={60} height={60} />
                    ) : (
                      'N/A'
                    )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-4 text-white">
                    <div className={clsx("status-badge", {
                                "bg-blue-600": candidature.status === "en attente",
                                "bg-green-600": candidature.status === "accepté",
                                "bg-red-600": candidature.status === "rejeté",
                                    })}>
                    <p className={clsx("text-12-semibold capitalize", {
                        "text-blue-500": candidature.status === "en attente",
                        "text-green-500": candidature.status === "accepté",
                        "text-red-500": candidature.status === "rejeté",
                    })}>
                      {candidature.status}
                    </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-4 text-white">{candidature?.electionId?.titre}</TableCell>
                  <TableCell className="py-2 px-4 flex items-center justify-center">
                    <button
                      onClick={() => handleApprove(candidature._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(candidature._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-700 transition duration-300"
                    >
                      Rejeter
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminCandidatures;
