import { Outlet } from "react-router-dom";
import Header from "./Header";
import PatientSideBar from "../PatientSideBar";

export default function AppLayout() {
  return (
    <div className="w-screen m-auto h-full  overflow-hidden">
      <div className="flex items-start w-full h-full">
        <div className="md:flex-[1.7] h-full w-full bg-white">
          <PatientSideBar />
        </div>
        <div className="md:flex-[8]  w-[100%] h-full overflow-y-scroll">
          <Header />
          <div className="w-full h-full  p-4">
            <main className="max-w-[185rem]  p-4 ">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
