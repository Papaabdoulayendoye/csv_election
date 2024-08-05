import React from 'react'
import Link from 'next/link'
import { UserProps } from '@/types'

const Navbar = ({user}: {user : UserProps}) => {
  const loggout = () => {
    localStorage.clear();
  };
  return (
    <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">E-Vote {user?.email === 'admin.evote@gmail.com' && 'Admin'}</Link>
          <div className="space-x-4">
            {user?.email === 'admin.evote@gmail.com' && 
            (
              <Link href="/admin/gestion-utilisateur" className="hover:text-secondary transition duration-300">Gestion des Utilisateurs</Link>
            )}
            {user?.email === 'admin.evote@gmail.com' && 
            (
              <Link href="/admin/gestion-candidat" className="hover:text-secondary transition duration-300">Gestion des candidats</Link>
            )}
            {user?.email === 'admin.evote@gmail.com' && 
            (
              <Link href="/admin/create-election" className="hover:text-secondary transition duration-300">Créer une élection</Link>
            )}
            <Link href="/profile" className="hover:text-secondary transition duration-300">Profil</Link>
            <Link href="/#" className="hover:text-secondary transition duration-300">Paramètres</Link>
            <Link href="/sign-in" onClick={loggout} className="hover:text-secondary transition duration-300">Déconnexion</Link>
          </div>
        </div>
      </nav>
  )
}

export default Navbar