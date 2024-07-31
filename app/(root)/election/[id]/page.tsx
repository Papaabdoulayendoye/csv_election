"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from 'react';
import { getCandidatesForElection } from '@/lib/actions/election.actions';

// Enregistrer les composants de graphique
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ModalProps {
children: ReactNode;
}
const Modal = ({ children }: ModalProps) => {
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
const [chartType, setChartType] = useState<'bar' | 'pie'>('bar'); // État pour le type de graphique sélectionné

useEffect(() => {
// Simuler les données des candidats et des élections
const fetchedCandidates = [
    { id: 1, name: "Jane Smith", bio: "Expérimentée en planification urbaine et développement communautaire", photo: "https://randomuser.me/api/portraits/women/1.jpg", votes: 1250 },
    { id: 2, name: "John Doe", bio: "Avocat pour l'énergie durable et la protection de l'environnement", photo: "https://randomuser.me/api/portraits/men/2.jpg", votes: 980 },
    // Ajoutez d'autres candidats ici
];

const labels = fetchedCandidates.map(c => c.name);
const data = fetchedCandidates.map(c => c.votes);

setCandidates(fetchedCandidates);
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
    const FetchCandidatesForElection = async () => {
        const response = await getCandidatesForElection(electionId);
        console.log("response",response);
    }
    FetchCandidatesForElection();
}, []);

const handleVote = (candidateName: string) => {
setSelectedCandidate(candidateName);
setShowModal(true);
};

const confirmVote = () => {
// Envoyer le vote au serveur ici
setShowModal(false);
alert('Vote soumis avec succès!');
router.push('/dashboard');
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
                <div key={candidate.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                <div className="relative">
                    <div className="candidate-photo w-48 h-48 mx-auto mt-6 rounded-full overflow-hidden">
                    <img src={candidate.photo} alt={candidate.name} width={192} height={192} className="w-full h-full object-cover" />
                    <div className="thumb-icon absolute inset-0 flex items-center justify-center bg-secondary bg-opacity-70">
                        <i className="fas fa-thumbs-up text-white text-4xl"></i>
                    </div>
                    </div>
                </div>
                <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold text-primary">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">{candidate.bio}</p>
                    <Button onClick={() => handleVote(candidate.name)} className="mt-4 w-full bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-300">
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
                    legend: { position: 'top' },
                    tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } }
                }
                }} />
            )}
            </div>
        </div>
        </div>
    </main>

    {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Confirmez votre vote</DialogTitle>
            <DialogDescription>
                Êtes-vous sûr de vouloir voter pour <span className="font-bold">{selectedCandidate}</span> ?
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button onClick={confirmVote} className="bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-300">
                Confirmer le vote
            </Button>
            <Button onClick={() => setShowModal(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition duration-300">
                Annuler
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )}
    </div>
</>
);
};

export default ElectionPage;
