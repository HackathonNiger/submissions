import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PatientAppLayout from "../components/ui/PatientAppLayout";
import SignUp from "../pages/SignupPage";
import Login from "../pages/LoginPage";
import PageNotFound from "../pages/PageNotFound";
import LandingPage from "../pages/LandingPage";
import PatientDashboard from "../pages/PatientDashboard";

const queryClient = new QueryClient();

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* PATIENT ROUTE */}
          <Route element={<PatientAppLayout />}>
            <Route path="/patient" element={<PatientDashboard />} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
