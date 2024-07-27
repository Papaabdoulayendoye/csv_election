const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Ce Que Disent Nos Utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-accent p-6 rounded-lg shadow-md">
            <p className="mb-4">"E-Vote a rendu la participation à nos élections locales beaucoup plus facile. J'ai pu voter depuis chez moi, et le processus était fluide et sécurisé."</p>
            <div className="flex items-center">
              <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah Johnson" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-sm text-gray-600">Electrice</p>
              </div>
            </div>
          </div>
          <div className="bg-accent p-6 rounded-lg shadow-md">
            <p className="mb-4">"En tant qu'agent électoral, E-Vote a rationalisé notre processus de vote et augmenté significativement les taux de participation."</p>
            <div className="flex items-center">
              <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Mark Thompson" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-semibold">Mark Thompson</h4>
                <p className="text-sm text-gray-600">Agent Électoral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
