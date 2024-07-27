"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Simuler les données utilisateur
const user = {
  name: "John Doe"
};

// Simuler les données d'élection
const elections = [
  { id: 1, title: "Élection du Conseil Municipal", description: "Votez pour vos représentants au conseil municipal", status: "en cours", startDate: "2023-06-01", endDate: "2023-06-15" },
  { id: 2, title: "Élection du Conseil Scolaire", description: "Choisissez les prochains membres du conseil scolaire", status: "à venir", startDate: "2023-07-01", endDate: "2023-07-15" },
  { id: 3, title: "Élection du Maire", description: "Sélectionnez le nouveau maire de notre ville", status: "terminée", startDate: "2023-05-01", endDate: "2023-05-15" },
  { id: 4, title: "Proposition de Rénovation du Parc", description: "Votez pour les plans de rénovation du parc proposés", status: "en cours", startDate: "2023-06-10", endDate: "2023-06-25" },
  { id: 5, title: "Initiative de Transport Public", description: "Décidez des nouvelles lignes de transport public", status: "à venir", startDate: "2023-08-01", endDate: "2023-08-15" },
  { id: 6, title: "Référendum Fiscal Local", description: "Votez pour les changements proposés aux taux d'imposition locaux", status: "terminée", startDate: "2023-04-15", endDate: "2023-04-30" }
];

const DashboardPage = () => {
  const router = useRouter();

  const handleElectionClick = (id: number) => {
    router.push(`/election/${id}`);
  };

  // Fonction pour créer une carte d'élection
  const createElectionCard = (election: any) => {
    return (
      <div key={election.id} className="bg-gray-50 rounded-lg p-4 shadow transition duration-300 hover:shadow-md">
        <h3 className="text-lg font-semibold text-primary">{election.title}</h3>
        <p className="text-gray-600 text-sm mt-2">{election.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className={`text-sm font-medium ${getStatusColor(election.status)}`}>
            {capitalizeFirstLetter(election.status)}
          </span>
          <Button onClick={() => handleElectionClick(election.id)} className="bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-300">
            Voir les candidats
          </Button>
        </div>
        {election.status !== "terminée" && (
          <p className="text-xs text-gray-500 mt-2">
            {formatDateRange(election.startDate, election.endDate)}
          </p>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en cours":
        return "text-green-600";
      case "à venir":
        return "text-blue-600";
      case "terminée":
        return "text-red-600";
      default:
        return "";
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatDateRange = (start: string, end: string) => {
    return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/dashboard" className="text-2xl font-bold">E-Vote</a>
          <div className="space-x-4">
            <a href="/#" className="hover:text-secondary transition duration-300">Profil</a>
            <a href="/#" className="hover:text-secondary transition duration-300">Paramètres</a>
            <a href="/sign-up" className="hover:text-secondary transition duration-300">Déconnexion</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Bienvenue, {user.name}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Élections en cours */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Élections en cours</h2>
            <div id="ongoing-elections" className="space-y-4">
              {elections.filter(election => election.status === "en cours").map(createElectionCard)}
            </div>
          </section>

          {/* Élections à venir */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Élections à venir</h2>
            <div id="upcoming-elections" className="space-y-4">
              {elections.filter(election => election.status === "à venir").map(createElectionCard)}
            </div>
          </section>

          {/* Élections terminées */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Élections terminées</h2>
            <div id="completed-elections" className="space-y-4">
              {elections.filter(election => election.status === "terminée").map(createElectionCard)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
