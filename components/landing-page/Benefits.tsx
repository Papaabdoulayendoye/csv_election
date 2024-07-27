const Benefits = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Avantages du Vote Électronique</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <i className="fas fa-users text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Participation Accrue</h3>
            <p>Rendre le vote accessible à un plus grand nombre de personnes, renforçant ainsi l'engagement démocratique.</p>
          </div>
          <div className="text-center">
            <i className="fas fa-lock text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Réduction de la Fraude</h3>
            <p>Des mesures de sécurité avancées préviennent les falsifications et garantissent l'intégrité des votes.</p>
          </div>
          <div className="text-center">
            <i className="fas fa-clock text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Commodité</h3>
            <p>Votez de n'importe où, à tout moment, éliminant ainsi le besoin de bureaux de vote physiques.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
