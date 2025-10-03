import React from "react";
import { Outlet } from "react-router-dom";
import PatientSideBar from "./PatientSideBar";
import Header from "./Header";

const PatientAppLayout: React.FC = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen((open) => !open);
  // };

  return (
    <div
      className="
        grid 
        grid-cols-[24rem_1fr] 
        grid-rows-[auto_1fr] 
        h-[100vh] 
        gap-2 
        tablet:grid-cols-1 
        tablet:grid-rows-[auto_auto_1fr]
        w-screen
        bg-red-800
      "
    >
      {/* Header */}
      <div className="bg-green-800 tablet:col-start-1 tablet:row-start-1">
        <Header />
      </div>

      {/* Sidebar */}
      <PatientSideBar />

      {/* Main Content */}
      <main className="p-16 w-full bg-gray-50 rounded-[15px] overflow-y-scroll scrollbar-hide tablet:col-start-1  tablet:row-start-3 tablet:p-12 mobileL:p-2    ">
        <div
          className="
            max-w-[120rem] 
            mx-auto 
            flex 
            flex-col 
            gap-12 
            mobileL:max-w-full
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientAppLayout;
