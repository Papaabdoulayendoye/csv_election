"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import {
  getCandidatesForElection,
  getElectionById,
  handleVoteActions,
} from "@/lib/actions/election.actions";
import { getCurrentUserActions } from "@/lib/actions/user.actions";
import { toast } from "react-toastify";
import { ElectionProps } from "@/types";
import Navbar from '@/components/Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Modal = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg p-5 border shadow-lg rounded-md bg-white">
        {children}
      </div>
    </div>
  );
};

const ElectionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const electionId = params.id;
  const [getElection, setGetElection] = useState<ElectionProps>();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVotingDisabled, setIsVotingDisabled] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rankingData, setRankingData] = useState<any>({ labels: [], datasets: [] });
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const colors = [
    "#0c2146",
    "rgba(255, 159, 64, 0.8)",
    "rgba(54, 153, 255, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(179, 204, 255, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(199, 199, 199, 0.8)",
    "rgba(83, 102, 136, 0.8)",
    "rgba(251, 120, 94, 0.8)",
    "rgba(255, 183, 77, 0.8)",
    "rgba(134, 207, 192, 0.8)",
    "rgba(255, 101, 101, 0.8)",
    "rgba(140, 140, 140, 0.8)",
  ];

  const getElectionStatus = (dateDebut: any, dateFin: any) => {
    const now = new Date();
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    if (now < startDate) {
      return "à venir";
    } else if (now > endDate) {
      return "terminée";
    } else {
      return "en cours";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const approvedCandidates = await getCandidatesForElection(electionId);
      const currentElection = await getElectionById(electionId);
      setGetElection(currentElection);
      const status = getElectionStatus(currentElection.dateDebut, currentElection.dateFin);
      setIsVotingDisabled(status !== "en cours");
      const labels = approvedCandidates.map((c: any) => c.fullName);
      const data = approvedCandidates.map((c: any) => c.votes);
      const backgroundColors = data.map(
        (_: any, index: any) => colors[index % colors.length]
      );
      const borderColors = backgroundColors.map((color: any) =>
        color.replace("0.8", "1")
      );
      setCandidates(approvedCandidates);
      setRankingData({
        labels,
        datasets: [
          {
            label: "Votes",
            data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    };
    fetchData();
  }, [electionId]);

  const handleVote = async ({
    candidateId,
    candidateName,
  }: {
    candidateId: string;
    candidateName: string;
  }) => {
    const userId = localStorage.getItem("currentUser");
    if (!userId) {
      return;
    }
    setSelectedCandidate(candidateId);
    setShowModal(true);
  };

  const confirmVote = async () => {
    const userId = localStorage.getItem("currentUser");
    if (!userId) {
      return;
    }
    const id = await getCurrentUserActions({ currentUser: userId });
    const response = await handleVoteActions({
      candidateId: selectedCandidate!,
      electionId,
      candidateName: "",
      userId: id._id,
    });
    setShowModal(false);
    if (response?.message) {
      if (response?.type === "success") {
        toast.success(response?.message);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        toast.error(response?.message);
      }
    }
  };

  const loggout = () => {
    localStorage.clear();
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {/* <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/dashboard" className="text-2xl font-bold">E-Vote</a>
            <div className="space-x-4">
              <a href="/dashboard" className="hover:text-secondary transition duration-300">Tableau de bord</a>
              <a href="/profile" className="hover:text-secondary transition duration-300">Profil</a>
              <a href="/sign-in" onClick={loggout} className="hover:text-secondary transition duration-300">Déconnexion</a>
            </div>
          </div>
        </nav> */}
        <Navbar />

        <main className="container mx-auto mt-8 px-4">
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">{getElection?.titre}</h1>

          <div className="flex justify-center mb-4 flex-wrap gap-2">
            <Button onClick={() => setChartType("bar")} className={`mr-2 ${chartType === "bar" ? "bg-secondary text-white" : "bg-white text-gray-800"}`}>Graphique en Barres</Button>
            <Button onClick={() => setChartType("pie")} className={`${chartType === "pie" ? "bg-secondary text-white" : "bg-white text-gray-800"}`}>Graphique Circulaire</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {candidates.map((candidate) => (
                  <div key={candidate._id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                    <div className="relative">
                      <div className="candidate-photo w-32 h-32 sm:w-48 sm:h-48 mx-auto mt-6 rounded-full overflow-hidden">
                        <img src={candidate.photo} alt={candidate.fullName} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold text-primary">{candidate.fullName}</h3>
                      <p className="text-gray-600 text-sm mt-2">{candidate.bio}</p>
                      <Button
                        disabled={isVotingDisabled}
                        onClick={() => handleVote({ candidateId: candidate._id, candidateName: candidate.fullName })}
                        className="mt-4 w-full bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-300"
                      >
                        Voter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
  <div className="bg-white rounded-lg shadow-md p-6 h-full">
    <h2 className="text-2xl font-semibold text-primary mb-4">Classement des Candidats</h2>
    <div className="overflow-y-auto ">
      {chartType === "bar" ? (
        <Bar
          data={rankingData}
          options={{
            indexAxis: "y",
            scales: {
              x: {
                beginAtZero: true,
              },
            },
            responsive: true,
            // plugins:{
            // legend: {display:false},
            // },
            maintainAspectRatio: false,
          }}
          className="chart-container"
          style={{ height: "350px" }}
        />
      ) : (
        <Pie
          data={rankingData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            // plugins: {
            //   legend: { position: 'right' },
            // }
          }}
          className="chart-container"
          style={{ height: "350px" }}
        />
      )}
    </div>
  </div>
</div>

          </div>
        </main>

        {showModal && (
          <Modal>
            <h2 className="text-lg font-semibold mb-4">Confirmation de Vote</h2>
            <p className="mb-4">Êtes-vous sûr de vouloir voter pour ce candidat ?</p>
            <div className="flex justify-end">
              <Button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button className="bg-secondary text-white px-4 py-2 rounded" onClick={confirmVote}>Confirmer</Button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ElectionPage;
