"use client"
import React, { useState } from 'react';

const Header = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-10">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-xl">E-Vote</span>
        </div>
        {/* Menu for desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#about" className="hover:text-secondary transition-colors">À propos</a>
          <a href="#features" className="hover:text-secondary transition-colors">Fonctionnalités</a>
          <a href="#how-it-works" className="hover:text-secondary transition-colors">Comment ça marche</a>
          <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
          <a href="/sign-in" className="hover:text-secondary transition-colors">Se connecter</a>
          <a href="/sign-up" className="hover:text-secondary transition-colors">S'inscrire</a>
        </div>
        {/* Menu for mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOuvert((prev) => !prev)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </nav>
      {/* Mobile menu */}
      <div className={`md:hidden ${menuOuvert ? 'block' : 'hidden'} bg-white shadow-md transition duration-300`}>
        <a href="/sign-in" className="block py-2 px-6 hover:text-secondary transition-colors">Se connecter</a>
        <a href="/sign-up" className="block py-2 px-6 hover:text-secondary transition-colors">S'inscrire</a>
        <a href="#about" className="block py-2 px-6 hover:text-secondary transition-colors">À propos</a>
        <a href="#features" className="block py-2 px-6 hover:text-secondary transition-colors">Fonctionnalités</a>
        <a href="#how-it-works" className="block py-2 px-6 hover:text-secondary transition-colors">Comment ça marche</a>
        <a href="#contact" className="block py-2 px-6 hover:text-secondary transition-colors">Contact</a>
      </div>
    </header>
  );
};

export default Header;
