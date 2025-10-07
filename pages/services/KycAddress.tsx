import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InputField: React.FC<{ label: string; type: string; placeholder: string; id: string; }> = (props) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{props.label}</label>
        <input 
            type={props.type} 
            id={props.id} 
            placeholder={props.placeholder}
            className="w-full h-12 px-4 bg-background-light dark:bg-background-dark border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
            required
        />
    </div>
);

const KycAddress: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const { fromOnboarding } = (location.state as { fromOnboarding?: boolean }) || {};
    
    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleTakePhoto = () => {
        cameraInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileName) {
            alert('Please upload a proof of address document.');
            return;
        }
        // Simulate API call and verification
        localStorage.setItem('kycLevel', '3');
        
        if (fromOnboarding) {
            localStorage.setItem('hasOnboarded', 'true');
            alert('Verification successful! Welcome to FinXchange.');
            navigate('/app/dashboard', { replace: true });
        } else {
            alert('Verification successful! Your account has been upgraded to Tier 3.');
            navigate('/kyc');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Upgrade to Tier 3</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">Provide your address and a utility bill to unlock unlimited transactions.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField id="address" label="Residential Address" type="text" placeholder="Enter your full street address" />
                <InputField id="city" label="City" type="text" placeholder="Enter your city" />
                <InputField id="state" label="State" type="text" placeholder="Enter your state" />
                
                <div>
                    <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Proof of Address</label>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">Upload a recent utility bill (e.g., electricity, water bill).</p>
                    
                    {/* Hidden file inputs for both methods */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*,application/pdf"
                    />
                    <input 
                        type="file" 
                        ref={cameraInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*"
                        capture="environment"
                    />

                    <div className="w-full h-12 px-4 flex items-center justify-center bg-background-light dark:bg-background-dark border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
                        {fileName ? `Selected: ${fileName}` : "No document selected"}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            type="button"
                            onClick={handleFileSelect}
                            className="w-full h-11 px-4 bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Upload File
                        </button>
                        <button 
                            type="button"
                            onClick={handleTakePhoto}
                            className="w-full h-11 px-4 bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Take Photo
                        </button>
                    </div>
                </div>

                <button type="submit" className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    Submit for Verification
                </button>
            </form>
        </div>
    );
};

export default KycAddress;