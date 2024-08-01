"use client";

import { PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { getCandidatesForElection, handleVoteActions } from '@/lib/actions/election.actions';
import { getCurrentUserActions } from '@/lib/actions/user.actions';

// Enregistrer les composants de graphique
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Modal = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {children}
      </div>
    </div>
  );
};

const ElectionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const electionId = params.id;
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rankingData, setRankingData] = useState<any>({ labels: [], datasets: [] });
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      const approvedCandidates = await getCandidatesForElection(electionId);
      console.log("approvedCandidates", approvedCandidates);
      
      const labels = approvedCandidates.map((c: any) => c.fullName);
      const data = approvedCandidates.map((c: any) => c.votes);

      setCandidates(approvedCandidates);
      setRankingData({
        labels,
        datasets: [{
          label: 'Votes',
          data,
          backgroundColor: 'rgba(52, 152, 219, 0.8)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 1
        }]
      });
    };

    fetchData();
  }, [electionId]);

  const handleVote = async (candidateId: string) => {
    const userId = localStorage.getItem("currentUser");
    if(!userId){
        return;
    }
    const id = await getCurrentUserActions({currentUser:userId});
    await handleVoteActions({candidateId,electionId,userId:id._id})
    window.location.reload();
  };

  const loggout = () => {
    localStorage.clear();
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/dashboard" className="text-2xl font-bold">E-Vote</a>
            <div className="space-x-4">
              <a href="/dashboard" className="hover:text-secondary transition duration-300">Tableau de bord</a>
              <a href="/profile" className="hover:text-secondary transition duration-300">Profil</a>
              <a href="/sign-in" onClick={loggout} className="hover:text-secondary transition duration-300">Déconnexion</a>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-8 px-4">
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">Élection {electionId}</h1>

          <div className="flex justify-center mb-4">
            <Button onClick={() => setChartType('bar')} className={`mr-2 ${chartType === 'bar' ? 'bg-secondary text-white' : 'bg-white text-gray-800'}`}>Graphique en Barres</Button>
            <Button onClick={() => setChartType('pie')} className={`${chartType === 'pie' ? 'bg-secondary text-white' : 'bg-white text-gray-800'}`}>Graphique Circulaire</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {candidates.map(candidate => (
                  <div key={candidate._id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                    <div className="relative">
                      <div className="candidate-photo w-48 h-48 mx-auto mt-6 rounded-full overflow-hidden">
                        <img src={candidate.photo} alt={candidate.fullName} width={192} height={192} className="w-full h-full object-cover" />
                        <div className="thumb-icon absolute inset-0 flex items-center justify-center bg-secondary bg-opacity-70">
                          <i className="fas fa-thumbs-up text-white text-4xl"></i>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold text-primary">{candidate.fullName}</h3>
                      <p className="text-gray-600 text-sm mt-2">{candidate.bio}</p>
                      <Button onClick={() => handleVote(candidate._id)} className="mt-4 w-full bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-300">
                        Voter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-primary mb-4">Classement des Candidats</h2>
                {chartType === 'bar' ? (
                  <Bar data={rankingData} options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: true, text: 'Classement des Candidats' }
                    },
                    scales: { x: { beginAtZero: true } }
                  }} />
                ) : (
                  <Pie data={rankingData} options={{
                    responsive: true,
                    plugins: {
                      legend: { display: true, position: 'bottom' },
                      title: { display: true, text: 'Répartition des Votes' }
                    }
                  }} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ElectionPage;
