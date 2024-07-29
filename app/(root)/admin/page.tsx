"use client"
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Admin = () => {
  const barData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Votes Comptés',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(52, 152, 219, 0.6)',
      borderColor: 'rgba(52, 152, 219, 1)',
      borderWidth: 1
    }]
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/dashboard" className="text-2xl font-bold">Admin E-Vote</a>
          <div className="space-x-4">
            <a href="/dashboard" className="hover:text-secondary transition duration-300">Tableau de bord</a>
            <a href="/admin/elections" className="hover:text-secondary transition duration-300">Élections</a>
            <a href="/admin/users" className="hover:text-secondary transition duration-300">Utilisateurs</a>
            <a href="/admin/reports" className="hover:text-secondary transition duration-300">Rapports</a>
            <a href="/admin/settings" className="hover:text-secondary transition duration-300">Paramètres</a>
            <a href="/admin/logout" className="hover:text-secondary transition duration-300">Déconnexion</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Gestion Générale</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Tableau de bord</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Élections Actives</h3>
              <p className="text-3xl font-bold text-secondary">12</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Total des Votes Comptés</h3>
              <p className="text-3xl font-bold text-secondary">24,567</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Engagement des Utilisateurs</h3>
              <p className="text-3xl font-bold text-secondary">78%</p>
            </div>
          </div>
          <div className="mt-8">
            <Bar data={barData} options={barOptions} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Gestion des Élections</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4 flex justify-between items-center">
              <input type="text" placeholder="Rechercher des élections..." className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" />
              <button className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                Ajouter une Nouvelle Élection
              </button>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Nom de l'Élection</th>
                  <th className="py-3 px-6 text-left">Date de Début</th>
                  <th className="py-3 px-6 text-left">Date de Fin</th>
                  <th className="py-3 px-6 text-left">Statut</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">Conseil Municipal 2023</td>
                  <td className="py-3 px-6 text-left">2023-06-01</td>
                  <td className="py-3 px-6 text-left">2023-06-15</td>
                  <td className="py-3 px-6 text-left">
                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Actif</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button className="transform hover:text-secondary hover:scale-110 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="transform hover:text-red-500 hover:scale-110 mr-3">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button className="transform hover:text-blue-500 hover:scale-110">
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* D'autres lignes d'élections seraient ajoutées dynamiquement ici */}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Gestion des Utilisateurs</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4 flex justify-between items-center">
              <input type="text" placeholder="Rechercher des utilisateurs..." className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary" />
              <button className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                Ajouter un Nouvel Utilisateur
              </button>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Nom</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Rôle</th>
                  <th className="py-3 px-6 text-left">Statut</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">John Doe</td>
                  <td className="py-3 px-6 text-left">johndoe@example.com</td>
                  <td className="py-3 px-6 text-left">Électeur</td>
                  <td className="py-3 px-6 text-left">
                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Actif</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button className="transform hover:text-secondary hover:scale-110 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="transform hover:text-red-500 hover:scale-110 mr-3">
                        <i className="fas fa-user-times"></i>
                      </button>
                      <button className="transform hover:text-blue-500 hover:scale-110">
                        <i className="fas fa-key"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* D'autres lignes d'utilisateurs seraient ajoutées dynamiquement ici */}
              </tbody>
            </table>
          </div>
        </section>

        {/* <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Rapports</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Statistiques Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-bold mb-2">Répartition des Votes</h4>
                <Pie
                  data={{
                    labels: ['Candidat A', 'Candidat B', 'Candidat C'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                  }}
                />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-bold mb-2">Activité des Utilisateurs</h4>
                <Pie
                  data={{
                    labels: ['Actif', 'Inactif', 'En Attente'],
                    datasets: [{
                      data: [200, 150, 50],
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                    }]
                  }}
                />
              </div>
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
}

export default Admin;
