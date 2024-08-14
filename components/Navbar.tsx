import React, { useState } from 'react';
import Link from 'next/link';
import { UserProps } from '@/types';

const Navbar = ({ user }: { user?: UserProps }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loggout = () => {
    localStorage.clear();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary text-white p-4 font-ibm-plex-serif">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-lg md:text-xl font-bold">
          E-Vote {user?.email === 'admin.evote@gmail.com' && 'Admin'}
        </Link>

        {/* Hamburger Menu for mobile */}
        <button
          className="lg:hidden block text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Links */}
        <div className={`lg:flex ${isMenuOpen ? 'block' : 'hidden'} space-y-4 lg:space-y-0 lg:space-x-2 md:space-x-4 text-xs md:text-sm`}>
          {user?.email === 'admin.evote@gmail.com' && (
            <Link href="/admin/gestion-utilisateur" className="block lg:inline-block hover:text-secondary transition duration-300">
              Gestion Utilisateurs
            </Link>
          )}
          {user?.email === 'admin.evote@gmail.com' && (
            <Link href="/admin/gestion-candidat" className="block lg:inline-block hover:text-secondary transition duration-300">
              Gestion Candidats
            </Link>
          )}
          {user?.email === 'admin.evote@gmail.com' && (
            <Link href="/admin/create-election" className="block lg:inline-block hover:text-secondary transition duration-300">
              Créer Élection
            </Link>
          )}
          <Link href="/dashboard" className="block lg:inline-block hover:text-secondary transition duration-300">
            Dashboard
          </Link>
          <Link href="/profile" className="block lg:inline-block hover:text-secondary transition duration-300">
            Profil
          </Link>
          <Link href="/#" className="block lg:inline-block hover:text-secondary transition duration-300">
            Paramètres
          </Link>
          <Link href="/sign-in" onClick={loggout} className="block lg:inline-block hover:text-secondary transition duration-300">
            Déconnexion
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
