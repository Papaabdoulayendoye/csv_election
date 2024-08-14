"use client";

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';

const ElectionCard = (election: any) => {
const router = useRouter();

const getStatusColor = (status: string) => {
switch (status) {
    case 'en cours':
    return 'text-green-500';
    case 'à venir':
    return 'text-blue-500';
    case 'terminée':
    return 'text-red-500';
    default:
    return '';
}
};

const capitalizeFirstLetter = (string: string) => {
return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDateRange = (start: string, end: string) => {
return `${new Date(start).toLocaleString()} - ${new Date(end).toLocaleString()}`;
};

const handleElectionClick = (id: string) => {
router.push(`/election/${id}`);
};

const handleApplyClick = (electionId: string) => {
console.log(`Postuler pour l'élection ${electionId}`);
};

const options: Intl.DateTimeFormatOptions = {
weekday: 'long' as const,
year: 'numeric' as const,
month: 'long' as const,
day: '2-digit' as const,
hour: '2-digit' as const,
minute: '2-digit' as const,
hour12: false as const,
};

return (
<div key={election._id} className="w-full max-w-sm md:max-w-md">
    <div className="bg-card-bg text-card-text rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold leading-tight">{election.titre}</h2>
        <div
            className={`bg-accent-blue text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full uppercase tracking-wide ${getStatusColor(
            election.status
            )}`}
        >
            {capitalizeFirstLetter(election.status)}
        </div>
        </div>
        <p className="text-slate-400 mb-4 md:mb-6 text-xs md:text-sm">{election.description}</p>
        <div className="flex items-center mb-4 md:mb-6">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 mr-2 text-accent-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
        <span className="text-xs md:text-sm">
            Débute le {new Date(election.dateDebut).toLocaleString('fr-FR', options).replace(' à ', ' à ').replace(':', 'h')}
        </span>
        </div>
        <div className="flex items-center justify-between mb-4 md:mb-8">
        <div className="flex items-center">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 mr-2 text-accent-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            </svg>
            <span className="text-xs md:text-sm">
            Termine le {new Date(election.dateFin).toLocaleString('fr-FR', options).replace(' à ', ' à ').replace(':', 'h')}
            </span>
        </div>
        <svg
            className="w-4 h-4 md:w-5 md:h-5 text-slate-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
        </svg>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between items-center">
        <Button
            onClick={() => handleElectionClick(election._id)}
            className="bg-secondary text-white text-center py-2 md:py-3 rounded-lg transition-colors duration-300 hover:bg-primary text-xs md:text-sm"
        >
            Voir les candidats
        </Button>
        {election.status === 'à venir' && (
            <Button
            onClick={() => handleApplyClick(election._id)}
            className="bg-blue-600 text-white text-center py-2 md:py-3 rounded-lg transition-colors duration-300 hover:bg-blue-700 text-xs md:text-sm"
            >
            <Link href={`/election/${election._id}/postuler`}>Postuler</Link>
            </Button>
        )}
        </div>
    </div>
    </div>
</div>
);
};

export default ElectionCard;
