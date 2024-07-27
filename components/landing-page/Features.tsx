const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Caractéristiques Clés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <i className="fas fa-shield-alt text-5xl text-secondary mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Vote Sécurisé</h3>
            <p>Technologie avancée de cryptage et de blockchain garantissant l'intégrité de chaque vote.</p>
          </div>
          <div className="text-center">
            <i className="fas fa-mobile-alt text-5xl text-secondary mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Facile à Utiliser</h3>
            <p>Interface intuitive accessible depuis tout appareil, rendant le vote simple et pratique.</p>
          </div>
          <div className="text-center">
            <i className="fas fa-chart-bar text-5xl text-secondary mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Résultats en Temps Réel</h3>
            <p>Comptage instantané des votes et visualisation des résultats pour des résultats transparents.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
