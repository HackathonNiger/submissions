import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, EyeOffIcon, XIcon, FreezeIcon, SettingsIcon } from '../components/icons';

interface CardDetails {
    id: number;
    label: string;
    number: string;
    expiry: string;
    cvv: string;
    color: string;
    frozen: boolean;
}

const colorOptions = [
    { name: 'blue', swatch: 'bg-blue-500', gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { name: 'red', swatch: 'bg-red-500', gradient: 'bg-gradient-to-br from-red-500 to-red-700' },
    { name: 'green', swatch: 'bg-green-500', gradient: 'bg-gradient-to-br from-green-500 to-green-700' },
    { name: 'purple', swatch: 'bg-purple-500', gradient: 'bg-gradient-to-br from-purple-500 to-purple-700' },
    { name: 'dark', swatch: 'bg-gray-800', gradient: 'bg-gradient-to-br from-gray-800 to-black' },
];

const initialCards: CardDetails[] = [
    { id: 1, label: 'Online Shopping', number: '5399 4567 8901 2345', expiry: '12/26', cvv: '123', color: colorOptions[0].gradient, frozen: false },
];

const CreateCardModal: React.FC<{ onClose: () => void; onCreate: (card: Omit<CardDetails, 'id' | 'number' | 'expiry' | 'cvv' | 'frozen'>) => void; }> = ({ onClose, onCreate }) => {
    const [label, setLabel] = useState('');
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!label) {
            alert('Please enter a card label.');
            return;
        }
        onCreate({ label, color: selectedColor.gradient });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Create New Card</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    <div>
                        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Card Color</label>
                        <div className="flex space-x-3">
                            {colorOptions.map(c => (
                                <button
                                    key={c.name}
                                    type="button"
                                    onClick={() => setSelectedColor(c)}
                                    className={`w-10 h-10 rounded-full ${c.swatch} transition-transform transform hover:scale-110 ${selectedColor.name === c.name ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-background-dark' : ''}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">Create Card</button>
                </form>
            </div>
        </div>
    );
};


const VirtualCard: React.FC<{ card: CardDetails; onFreezeToggle?: () => void }> = ({ card, onFreezeToggle }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);
    const backgroundClass = card.frozen ? 'bg-slate-400' : card.color;

    return (
        <div className={`w-full aspect-[1.586] flex flex-col justify-between p-5 rounded-xl text-white shadow-lg relative overflow-hidden transition-colors duration-300 ${backgroundClass}`}>
            {card.frozen && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <FreezeIcon />
                    <span className="mt-2 font-bold text-lg">FROZEN</span>
                </div>
            )}
            <div>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">FinXchange</span>
                    <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fillOpacity="0.01"/><path d="M40 18H8V34H40V18Z" fill="#fff" stroke="#fff" strokeWidth="4" strokeLinejoin="round"/><path d="M8 18V10C8 6.68629 10.6863 4 14 4H34C37.3137 4 40 6.68629 40 10V18" stroke="#fff" strokeWidth="4" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-xs mt-1">{card.label}</p>
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <p className="text-xl font-mono tracking-widest">{detailsVisible ? card.number : `**** **** **** ${card.number.slice(-4)}`}</p>
                    <button onClick={() => setDetailsVisible(!detailsVisible)} className="z-20">
                        {detailsVisible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
                <div className="flex text-sm mt-2 font-mono">
                    <div className="mr-8">
                        <p className="text-xs opacity-80">VALID THRU</p>
                        <p>{card.expiry}</p>
                    </div>
                     <div>
                        <p className="text-xs opacity-80">CVV</p>
                        <p>{detailsVisible ? card.cvv : '***'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CardActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }> = ({ icon, label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="flex flex-col items-center space-y-1 text-center disabled:opacity-50">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-text-light dark:text-text-dark">
            {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
    </button>
);


const Cards: React.FC = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState<CardDetails[]>(() => {
        const savedCards = localStorage.getItem('virtualCards');
        if (savedCards) {
            try {
                return JSON.parse(savedCards);
            } catch (e) {
                return initialCards;
            }
        }
        return initialCards;
    });
    const [activeCardIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        localStorage.setItem('virtualCards', JSON.stringify(cards));
    }, [cards]);

    const activeCard = cards[activeCardIndex];

    const handleCreateCard = (newCardData: Omit<CardDetails, 'id' | 'number' | 'expiry' | 'cvv' | 'frozen'>) => {
        const newCard: CardDetails = {
            ...newCardData,
            id: Date.now(),
            number: `5399 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
            expiry: `12/${new Date().getFullYear() % 100 + 3}`,
            cvv: `${Math.floor(100 + Math.random() * 900)}`,
            frozen: false,
        };
        setCards(prev => [...prev, newCard]);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Cards</h1>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full shadow-lg shadow-primary/30">
                       <PlusIcon />
                    </button>
                </div>
                
                {activeCard ? (
                    <>
                        <VirtualCard card={activeCard} />
                        <div className="grid grid-cols-3 gap-4 text-center my-6 p-4 bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                            <CardActionButton 
                                icon={<FreezeIcon />} 
                                label={activeCard.frozen ? 'Unfreeze' : 'Freeze Card'}
                                onClick={() => navigate(`/card/${activeCard.id}/freeze`, { state: { card: activeCard } })}
                            />
                            <CardActionButton 
                                icon={<SettingsIcon />} 
                                label="Settings" 
                                onClick={() => navigate(`/card/${activeCard.id}/settings`, { state: { card: activeCard } })}
                            />
                            <CardActionButton 
                                icon={<PlusIcon />} 
                                label="Fund Card" 
                                onClick={() => navigate(`/card/${activeCard.id}/fund`, { state: { card: activeCard } })}
                             />
                        </div>

                        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4">
                            <h2 className="font-bold mb-2">Recent Transactions</h2>
                            <p className="text-sm text-center text-text-muted-light dark:text-text-muted-dark py-4">No transactions on this card yet.</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-8 bg-card-light dark:bg-card-dark rounded-xl">
                        <p className="text-text-muted-light dark:text-text-muted-dark">You don't have any virtual cards.</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 font-bold text-primary">Create Your First Card</button>
                    </div>
                )}
            </div>

            {isModalOpen && <CreateCardModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateCard} />}
        </>
    );
};

export default Cards;