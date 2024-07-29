"use client"
import { useEffect, useState } from 'react';

const candidatesData = [
  { id: 1, name: "John Doe", applicationDate: "2023-05-01", election: "Local Council", status: "Pending", bio: "Experienced in local governance with a focus on community development.", qualifications: "MBA, 10 years in public service" },
  { id: 2, name: "Jane Smith", applicationDate: "2023-05-02", election: "State Senate", status: "Approved", bio: "Passionate about education reform and environmental protection.", qualifications: "Ph.D. in Public Policy, Former School Board Member" },
  { id: 3, name: "Mike Johnson", applicationDate: "2023-05-03", election: "National Parliament", status: "Rejected", bio: "Advocate for small businesses and economic growth.", qualifications: "Business Owner, Economics Degree" },
  { id: 4, name: "Sarah Brown", applicationDate: "2023-05-04", election: "Local Mayor", status: "Pending", bio: "Committed to improving city infrastructure and public services.", qualifications: "Civil Engineer, City Planner" },
  { id: 5, name: "Robert Lee", applicationDate: "2023-05-05", election: "State Governor", status: "Pending", bio: "Focused on job creation and fiscal responsibility.", qualifications: "Former CEO, Economics Professor" }
];

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState(candidatesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [electionFilter, setElectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const viewCandidateDetails = (id:Number) => {
    const candidate = candidates.find(c => c.id === id);
    setSelectedCandidate(candidate!);
  };

  const updateCandidateStatus = (id:Number, newStatus:any) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    ));
    alert(`Le statut du candidat a été mis à jour en ${newStatus}`);
  };

  const applyFilters = () => {
    let filteredCandidates = candidatesData;

    if (searchTerm) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.election.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (electionFilter) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.election.toLowerCase().includes(electionFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.status === statusFilter
      );
    }

    if (dateFilter) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.applicationDate >= dateFilter
      );
    }

    setCandidates(filteredCandidates);
  };

  const batchAction = (action:any) => {
    const pendingCandidates = candidates.filter(c => c.status === 'Pending');
    if (pendingCandidates.length === 0) {
      alert('Aucune candidature en attente à traiter.');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir ${action.toLowerCase()} toutes les candidatures en attente ?`)) {
      setCandidates(candidates.map(candidate =>
        candidate.status === 'Pending' ? { ...candidate, status: action } : candidate
      ));
      alert(`Batch ${action.toLowerCase()} terminé avec succès.`);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, electionFilter, statusFilter, dateFilter]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/admin/dashboard" className="text-2xl font-bold">E-Vote Admin</a>
          <div className="space-x-4">
            <a href="/admin/dashboard" className="hover:text-secondary transition duration-300">Dashboard</a>
            <a href="/admin/elections" className="hover:text-secondary transition duration-300">Elections</a>
            <a href="/admin/logout" className="hover:text-secondary transition duration-300">Logout</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Gestion des Candidatures</h1>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Rechercher des candidats..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-2/3 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              onChange={(e) => setElectionFilter(e.target.value)}
            >
              <option value="">Toutes les élections</option>
              <option value="local">Élections locales</option>
              <option value="state">Élections d'état</option>
              <option value="national">Élections nationales</option>
            </select>
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Nom du candidat</th>
                <th className="py-3 px-6 text-left">Date de candidature</th>
                <th className="py-3 px-6 text-left">Élection</th>
                <th className="py-3 px-6 text-left">Statut</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {candidates.map(candidate => (
                <tr key={candidate.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{candidate.applicationDate}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{candidate.election}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className={`bg-${getStatusColor(candidate.status)}-200 text-${getStatusColor(candidate.status)}-600 py-1 px-3 rounded-full text-xs`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button className="view-details transform hover:text-secondary hover:scale-110 mr-3" onClick={() => viewCandidateDetails(candidate.id)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="approve-candidate transform hover:text-green-500 hover:scale-110 mr-3" onClick={() => updateCandidateStatus(candidate.id, 'Approved')}>
                        <i className="fas fa-check"></i>
                      </button>
                      <button className="reject-candidate transform hover:text-red-500 hover:scale-110" onClick={() => updateCandidateStatus(candidate.id, 'Rejected')}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCandidate && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Détails du candidat</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{selectedCandidate.name}</h3>
              <p className="text-gray-700 mb-2"><strong>Date de candidature:</strong> {selectedCandidate.applicationDate}</p>
              <p className="text-gray-700 mb-2"><strong>Élection:</strong> {selectedCandidate.election}</p>
              <p className="text-gray-700 mb-2"><strong>Statut:</strong> {selectedCandidate.status}</p>
              <p className="text-gray-700 mb-2"><strong>Bio:</strong> {selectedCandidate.bio}</p>
              <p className="text-gray-700 mb-2"><strong>Qualifications:</strong> {selectedCandidate.qualifications}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300" onClick={() => batchAction('Approve')}>Approuver tout</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300" onClick={() => batchAction('Reject')}>Rejeter tout</button>
        </div>
      </main>
    </div>
  );
};

export default ManageCandidates;
