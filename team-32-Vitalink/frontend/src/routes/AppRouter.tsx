import { QueryClient, QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { FullScreenLoader } from "../components/ui/Loader";

const queryClient = new QueryClient();

function AppContent() {
  const isFetching = useIsFetching();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Show loader for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {(isFetching > 0 || isLoading) && <FullScreenLoader />}
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
    </>
  );
}

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </QueryClientProvider>
  );
}
