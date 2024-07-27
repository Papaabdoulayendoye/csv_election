const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-accent">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Comment Ça Fonctionne</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
          <div className="text-center">
            <div className="bg-white rounded-full p-6 inline-block mb-4">
              <i className="fas fa-user-plus text-4xl text-secondary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Inscription</h3>
            <p>Créez votre compte sécurisé</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-6 inline-block mb-4">
              <i className="fas fa-vote-yea text-4xl text-secondary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Votez</h3>
            <p>Exprimez votre vote en toute sécurité</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-6 inline-block mb-4">
              <i className="fas fa-poll text-4xl text-secondary"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Voir les Résultats</h3>
            <p>Consultez les résultats des élections en temps réel</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
