"use client";
import { useState, useEffect } from 'react';

const NewsletterModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert('Merci pour votre inscription !');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">Restez Informé</h3>
        <p className="mb-4">Abonnez-vous à notre newsletter pour les dernières mises à jour et fonctionnalités.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Votre email" className="w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded hover:bg-primary transition-colors">S'abonner</button>
        </form>
        <button onClick={handleClose} className="mt-4 text-sm text-gray-600 hover:text-gray-800">Non merci, peut-être plus tard</button>
      </div>
    </div>
  );
};

export default NewsletterModal;
