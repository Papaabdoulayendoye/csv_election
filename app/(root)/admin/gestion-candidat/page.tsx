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
import Candidature from '@/lib/models/candidat';
import { parseStringify } from '@/lib/utils';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en attente":
        return "text-blue-400";
      case "accepté":
        return "text-green-500";
      case "rejeté":
        return "text-red-500";
      default:
        return "text-gray-500";
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
    <div className="bg-gray-900 min-h-screen p-4">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">E-Vote {user?.email === 'admin.evote@gmail.com' && 'Admin'}</Link>
          <div className="space-x-4">
            {user?.email === 'admin.evote@gmail.com' && 
            (
              <Link href="/admin/gestion-candidat" className="hover:text-secondary transition duration-300">Gestion des candidats</Link>
            )}
            {user?.email === 'admin.evote@gmail.com' && 
            (
              <Link href="/admin/create-election" className="hover:text-secondary transition duration-300">Créer une élection</Link>
            )}
            <Link href="/#" className="hover:text-secondary transition duration-300">Profil</Link>
            <Link href="/#" className="hover:text-secondary transition duration-300">Paramètres</Link>
            <Link href="/sign-in" onClick={loggout} className="hover:text-secondary transition duration-300">Déconnexion</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Gestion des Candidatures</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-white">Total Candidatures</h2>
            <p className="text-2xl text-gray-400">{totalCandidatures}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-white">En Attente</h2>
            <p className="text-2xl text-gray-400">{pendingCandidatures}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-white">Approuvées</h2>
            <p className="text-2xl text-gray-400">{acceptedCandidatures}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-white">Rejetées</h2>
            <p className="text-2xl text-gray-400">{rejectedCandidatures}</p>
          </div>
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg p-6">
          <Table>
            <TableCaption>Liste des candidatures récentes.</TableCaption>
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
                    {candidature.photo ? (
                      <Image src={candidature.photo} alt={candidature.fullName} width={50} height={50} />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-white">
                    <span className={`inline-block py-1 px-2 rounded-full text-xs font-bold ${getBgStatusColor(candidature.status)}`}>
                      {candidature.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 px-4 text-white">{candidature?.electionId?.titre}</TableCell>
                  <TableCell className="py-2 px-4">
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
