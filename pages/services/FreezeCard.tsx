import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FreezeIcon } from '../../components/icons';

interface CardDetails {
    id: number;
    label: string;
    number: string;
    expiry: string;
    cvv: string;
    color: string;
    frozen: boolean;
}

const CardPreview: React.FC<{ card: CardDetails }> = ({ card }) => (
    <div className={`w-full max-w-xs aspect-[1.586] flex flex-col justify-between p-5 rounded-xl text-white shadow-lg relative overflow-hidden transition-colors duration-300 ${card.color}`}>
        <div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-lg">FinXchange</span>
            </div>
            <p className="text-xs mt-1">{card.label}</p>
        </div>
        <div>
            <p className="text-xl font-mono tracking-widest">{`**** **** **** ${card.number.slice(-4)}`}</p>
        </div>
    </div>
);


const FreezeCard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { card } = location.state as { card: CardDetails };

    if (!card) {
        return <div className="p-4">Card not found.</div>;
    }

    const handleConfirm = () => {
        const savedCardsJSON = localStorage.getItem('virtualCards');
        if (savedCardsJSON) {
            let savedCards: CardDetails[] = JSON.parse(savedCardsJSON);
            savedCards = savedCards.map(c => 
                c.id === card.id ? { ...c, frozen: !card.frozen } : c
            );
            localStorage.setItem('virtualCards', JSON.stringify(savedCards));
        }
        alert(`Card has been ${card.frozen ? 'unfrozen' : 'frozen'} successfully.`);
        navigate('/app/cards');
    };

    return (
        <div className="p-6 flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                {card.frozen ? 'Unfreeze Card' : 'Freeze Card'}
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                {card.frozen 
                    ? 'Unfreezing this card will allow it to be used for transactions again.'
                    : 'Freezing this card will temporarily block all transactions.'}
            </p>
            
            <CardPreview card={card} />
            
            <button
                onClick={handleConfirm}
                className="w-full max-w-xs mt-8 h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
                Confirm {card.frozen ? 'Unfreeze' : 'Freeze'}
            </button>
        </div>
    );
};

export default FreezeCard;