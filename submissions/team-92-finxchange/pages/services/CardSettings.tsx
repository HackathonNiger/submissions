import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface CardDetails {
    id: number;
    label: string;
    number: string;
    expiry: string;
    cvv: string;
    color: string;
    frozen: boolean;
}

const CardSettings: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { card } = location.state as { card: CardDetails };

    const [label, setLabel] = useState(card?.label || '');

    useEffect(() => {
        if (!card) {
            // If no card data is passed, navigate back
            navigate('/app/cards');
        }
    }, [card, navigate]);

    if (!card) {
        return null; // Render nothing while redirecting
    }
    
    const updateCardsInStorage = (updatedCards: CardDetails[]) => {
        localStorage.setItem('virtualCards', JSON.stringify(updatedCards));
    };

    const getCardsFromStorage = (): CardDetails[] => {
        const savedCardsJSON = localStorage.getItem('virtualCards');
        return savedCardsJSON ? JSON.parse(savedCardsJSON) : [];
    }

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        const allCards = getCardsFromStorage();
        const updatedCards = allCards.map(c => 
            c.id === card.id ? { ...c, label } : c
        );
        updateCardsInStorage(updatedCards);
        alert('Card settings saved!');
        navigate('/app/cards');
    };

    const handleDeleteCard = () => {
        if (window.confirm('Are you sure you want to permanently delete this card? This action cannot be undone.')) {
            const allCards = getCardsFromStorage();
            const updatedCards = allCards.filter(c => c.id !== card.id);
            updateCardsInStorage(updatedCards);
            alert('Card deleted successfully.');
            navigate('/app/cards');
        }
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSaveChanges} className="space-y-6">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Card Label</label>
                    <input
                        type="text"
                        id="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g., Subscriptions"
                        className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        required
                    />
                </div>

                {/* Placeholder for future settings */}
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                    Spending limits and other controls coming soon.
                </div>
                
                <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Save Changes
                </button>
            </form>
            
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <button
                    onClick={handleDeleteCard}
                    className="w-full h-12 flex items-center justify-center bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors"
                >
                    Delete Card
                </button>
            </div>
        </div>
    );
};

export default CardSettings;