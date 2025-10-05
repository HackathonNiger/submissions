import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignupPage";
import Login from "../pages/LoginPage";
import PageNotFound from "../pages/PageNotFound";
import LandingPage from "../pages/LandingPage";
import PatientDashboard from "../pages/PatientDashboard";
import { UserProvider } from "../contexts/UserContext";
import ChatUI from "../components/sections/patient/chat_components/ChaiUI";
import AISuggestionsPage from "../pages/AISuggestionsPage";
import SettingsPage from "../pages/SettingsPage";
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientsPage from "../pages/PatientsPage";
import AnalyticsPage from "../pages/AnalyticsPage";

const queryClient = new QueryClient();

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/chat" element={<ChatUI />} />
            <Route path="/patient/suggestions" element={<AISuggestionsPage />} />
            <Route path="/patient/settings" element={<SettingsPage />} />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<PatientsPage />} />
            <Route path="/doctor/analytics" element={<AnalyticsPage />} />
            <Route path="/doctor/settings" element={<SettingsPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}
