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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Navbar from '@/components/Navbar';
import ElectionCard from '@/components/ElectionCard';
import Sidebar from '@/components/Sidebar';

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
        const response = await getCurrentUserActions({ currentUser });
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


  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="bg-gray-100 min-h-screen flex">
      {user?.email === 'admin.evote@gmail.com' && 
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} user={user}/>
      }
      <div className={`flex-1 ${user?.email === 'admin.evote@gmail.com' ? (isCollapsed ? 'ml-20' : 'ml-64') + ' transition-margin duration-300' : ''}`}>
      <Navbar user={user!} />
      <main className="container font-ibm-plex-serif mx-auto mt-8 px-4">
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
          {/* {sortedElections.map(createElectionCard)} */}
          {sortedElections.map(ElectionCard)}
        </div>

        <Pagination className='mb-4'>
          <PaginationContent>
            <PaginationItem>
              <Button disabled={currentPage === 1} className='text-white hover:bg-slate-800'>
                <PaginationPrevious className="hover:bg-slate-800" href="#" onClick={() => handlePageChange(currentPage - 1)} />
              </Button>
            </PaginationItem>
            {Array.from({ length: Math.ceil(elections.length / 10) }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink className=''
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button disabled={!isNext} className='text-white hover:bg-slate-800'>
                <PaginationNext className='hover:bg-slate-800' href="#" onClick={() => handlePageChange(currentPage + 1)} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
      </div>
      </div>
  );
};

export default DashboardPage;
