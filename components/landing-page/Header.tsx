"use client";
import { useState } from 'react';

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
        <div className={`hidden md:flex items-center space-x-6 ${menuOuvert ? 'block' : 'hidden'}`}>
          <a href="#about" className="hover:text-secondary transition-colors">À propos</a>
          <a href="#features" className="hover:text-secondary transition-colors">Fonctionnalités</a>
          <a href="#how-it-works" className="hover:text-secondary transition-colors">Comment ça marche</a>
          <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
        </div>
        <button className="md:hidden focus:outline-none" onClick={() => setMenuOuvert(!menuOuvert)}>
          <i className="fas fa-bars"></i>
        </button>
      </nav>
    </header>
  );
};

export default Header;
