const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">E-Vote</h3>
            <p>Vote électronique sécurisé et pratique pour une meilleure démocratie.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul>
              <li><a href="#" className="hover:text-accent">À Propos</a></li>
              <li><a href="#" className="hover:text-accent">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-accent">Comment Ça Fonctionne</a></li>
              <li><a href="#" className="hover:text-accent">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Légal</h4>
            <ul>
              <li><a href="#" className="hover:text-accent">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-accent">Conditions d'Utilisation</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Connectez-vous avec Nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent"><i className="fab fa-facebook"></i></a>
              <a href="#" className="hover:text-accent"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-accent"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 E-Vote. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
