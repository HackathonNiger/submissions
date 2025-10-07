import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mapping from "./pages/Mapping";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import FarmInfoPage from "./pages/FarmInfoPage";

const App = () => {
  return (
    <Router>
      <div className="flex">
    
        {/* Main content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<Mapping />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signup" element={<FarmInfoPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
