"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from 'react';
import { getCurrentUserActions } from '@/lib/actions/user.actions';
import { UserProps } from '@/types';
import Link from 'next/link';
import { fetchElections } from '@/lib/actions/election.actions';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProps>();
  const [elections, setElections] = useState<any[]>([]);
  const [filteredElections, setFilteredElections] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNext, setIsNext] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    const loadElections = async () => {
      const { elections, isNext } = await fetchElections(currentPage);
      setElections(elections);
      setIsNext(isNext);
    };
    loadElections();
  }, [currentPage]);

  useEffect(() => {
    let filtered = elections;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(election => election.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(election =>
        election.titre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredElections(filtered);
  }, [elections, statusFilter, searchTerm]);

  const sortElections = (elections: any[]) => {
    const now = new Date();

    const ongoing = elections.filter(election => {
      const dateDebut = new Date(election.dateDebut);
      const dateFin = new Date(election.dateFin);
      return dateDebut <= now && dateFin >= now;
    });

    const upcoming = elections.filter(election => {
      const dateDebut = new Date(election.dateDebut);
      return dateDebut > now;
    });

    const completed = elections.filter(election => {
      const dateFin = new Date(election.dateFin);
      return dateFin < now;
    });

    return [...ongoing, ...upcoming, ...completed];
  };

  const sortedElections = sortElections(filteredElections);
  const loggout = () => {
    localStorage.clear();
  };

  const handleElectionClick = (id: string) => {
    router.push(`/election/${id}`);
  };

  const handleApplyClick = (electionId: string) => {
    // Logique pour postuler à l'élection
    console.log(`Postuler pour l'élection ${electionId}`);
    // Rediriger ou afficher un formulaire de candidature
  };

  const createElectionCard = (election: any) => {
    return (
      <div key={election._id} className="bg-gray-50 rounded-lg p-4 shadow transition duration-300 hover:shadow-md">
        <h3 className="text-lg font-semibold text-primary">{election.titre}</h3>
        <p className="text-gray-600 text-sm mt-2">{election.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className={`text-sm font-medium ${getStatusColor(election.status)}`}>
            {capitalizeFirstLetter(election.status)}
          </span>
          <div className="flex gap-2">
            <Button onClick={() => handleElectionClick(election._id)} className="bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-300">
              Voir les candidats
            </Button>
            {election.status === "à venir" && (
              <Button
                onClick={() => handleApplyClick(election._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition duration-300"
              >
                <Link className='' href={`/election/${election._id}/postuler`}>
                  Postuler
                </Link>
              </Button>
            )}
          </div>
        </div>
        {election.status !== "terminée" && (
          <p className="text-xs text-gray-500 mt-2">
            {formatDateRange(election.dateDebut, election.dateFin)}
          </p>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en cours":
        return "text-green-600";
      case "à venir":
        return "text-blue-600";
      case "terminée":
        return "text-red-600";
      default:
        return "";
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatDateRange = (start: string, end: string) => {
    return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Réinitialiser la pagination lorsque le filtre change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser la pagination lorsque la recherche change
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">E-Vote {user?.email === 'admin.evote@gmail.com' && 'Admin'}</Link>
          <div className="space-x-4">
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
        <div className='mb-8'>
          <h1 className="text-3xl font-bold text-primary mb-2">Bienvenue, {user?.nom}</h1>
          <p className='text-14 truncate font-normal text-gray-700'>
              {user?.email}
          </p>
        </div>

        <div className="mb-4 flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher une élection..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1"
          />
          
          <div className="mb-4 flex gap-4">
          <Select
            value={statusFilter}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Statut</SelectLabel>
                <SelectItem value="all">Tout</SelectItem>
                <SelectItem value="en cours">En cours</SelectItem>
                <SelectItem value="à venir">À venir</SelectItem>
                <SelectItem value="terminée">Terminée</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
          {sortedElections.map(createElectionCard)}
        </div>

        <Pagination className='mb-4'>
          <PaginationContent>
            <PaginationItem>
              <Button disabled={currentPage === 1} className='text-white'>
              <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)}   />
              </Button>
            </PaginationItem>
            {Array.from({ length: Math.ceil(elections.length / 10) }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button disabled={!isNext} className='text-white'>
              <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </div>
  );
};

export default DashboardPage;
