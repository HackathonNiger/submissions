
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Transactions from './pages/Transactions';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Save from './pages/Save';
import ServicePageLayout from './layouts/ServicePageLayout';
import AddMoney from './pages/services/AddMoney';
import Transfer from './pages/services/Transfer';
import Withdraw from './pages/services/Withdraw';
import Airtime from './pages/services/Airtime';
import Data from './pages/services/Data';
import TV from './pages/services/TV';
import Electricity from './pages/services/Electricity';
import Internet from './pages/services/Internet';
import ExamPin from './pages/services/ExamPin';
import Betting from './pages/services/Betting';
import Welcome from './pages/onboarding/Welcome';
import CreateAccount from './pages/onboarding/CreateAccount';
import SignIn from './pages/onboarding/SignIn';
import OTP from './pages/onboarding/OTP';
import PinSetup from './pages/onboarding/PinSetup';
import PinLogin from './pages/onboarding/PinLogin';
import Loans from './pages/Loans';
import GroupSavings from './pages/GroupSavings';
import Notifications from './pages/Notifications';
import Referrals from './pages/Referrals';
import Chatbot from './pages/Chatbot';
import WaterBill from './pages/services/WaterBill';
import SchoolFees from './pages/services/SchoolFees';
import TransactionDetail from './pages/TransactionDetail';
import Finance from './pages/Finance';
import Cards from './pages/Cards';
import FreezeCard from './pages/services/FreezeCard';
import CardSettings from './pages/services/CardSettings';
import FundCard from './pages/services/FundCard';
import KYC from './pages/KYC';
import KycBvnNin from './pages/services/KycBvnNin';
import KycAddress from './pages/services/KycAddress';
import KycOnboarding from './pages/onboarding/KycOnboarding';
import SuccessPage from './pages/SuccessPage';
import VoicePayment from './pages/VoicePayment';
import AccountInfo from './pages/AccountInfo';
import SecuritySettings from './pages/SecuritySettings';
import LanguageSettings from './pages/LanguageSettings';
import ChangePin from './pages/ChangePin';
import ChangePassword from './pages/ChangePassword';
import LoginHistory from './pages/LoginHistory';
import CreateSavingGoal from './pages/services/CreateSavingGoal';
import EditSavingGoal from './pages/services/EditSavingGoal';
import CreateGroupSaving from './pages/services/CreateGroupSaving';


const App: React.FC = () => {
    // A simple check to see if dark mode is preferred
    React.useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<SplashScreen />} />

                {/* Onboarding Routes */}
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/otp" element={<OTP />} />
                <Route path="/pin-setup" element={<PinSetup />} />
                <Route path="/pin-login" element={<PinLogin />} />
                <Route path="/kyc-onboarding" element={<KycOnboarding />} />
                <Route path="/success" element={<SuccessPage />} />
                
                {/* Main app routes with bottom navigation */}
                <Route path="/app" element={<MainLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="services" element={<Services />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="finance" element={<Finance />} />
                    <Route path="voice-payment" element={<VoicePayment />} />
                    <Route path="save" element={<Save />} />
                    <Route path="cards" element={<Cards />} />
                    <Route path="support" element={<Support />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="loans" element={<Loans />} />
                    <Route path="group-savings" element={<GroupSavings />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="referrals" element={<Referrals />} />
                    <Route path="chatbot" element={<Chatbot />} />
                </Route>

                {/* Service pages without bottom navigation, using a dedicated layout */}
                <Route element={<ServicePageLayout />}>
                    <Route path="/add-money" element={<AddMoney />} />
                    <Route path="/transfer" element={<Transfer />} />
                    <Route path="/withdraw" element={<Withdraw />} />
                    <Route path="/airtime" element={<Airtime />} />
                    <Route path="/data" element={<Data />} />
                    <Route path="/tv" element={<TV />} />
                    <Route path="/electricity" element={<Electricity />} />
                    <Route path="/internet" element={<Internet />} />
                    <Route path="/exam-pin" element={<ExamPin />} />
                    <Route path="/betting" element={<Betting />} />
                    <Route path="/water-bill" element={<WaterBill />} />
                    <Route path="/school-fees" element={<SchoolFees />} />
                    <Route path="/transaction/:id" element={<TransactionDetail />} />
                    <Route path="/card/:id/freeze" element={<FreezeCard />} />
                    <Route path="/card/:id/settings" element={<CardSettings />} />
                    <Route path="/card/:id/fund" element={<FundCard />} />
                    <Route path="/kyc" element={<KYC />} />
                    <Route path="/kyc/bvn-nin" element={<KycBvnNin />} />
                    <Route path="/kyc/address" element={<KycAddress />} />
                    <Route path="/create-saving-goal" element={<CreateSavingGoal />} />
                    <Route path="/edit-saving-goal/:id" element={<EditSavingGoal />} />
                    <Route path="/create-group-saving" element={<CreateGroupSaving />} />
                    <Route path="/account-info" element={<AccountInfo />} />
                    <Route path="/security-settings" element={<SecuritySettings />} />
                    <Route path="/language-settings" element={<LanguageSettings />} />
                    <Route path="/change-pin" element={<ChangePin />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/login-history" element={<LoginHistory />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
