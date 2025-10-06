import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Activity } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { DoctorSidebar } from "../../sidebars/DoctorSidebar";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { usePatients } from "../../../contexts/PatientsContext";

const Patients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { patients } = usePatients();

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "normal":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <SidebarProvider className="w-screen min-h-screen overflow-hidden h-full">
      <div className="min-h-screen flex w-full bg-background">
        <DoctorSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">My Patients</h1>
              <p className="text-sm text-muted-foreground">Manage and monitor your patient list</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 sm:pr-0 pr-10 max-w-4xl mx-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search patients by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Patient Cards */}
              <div className="grid gap-4">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className="cursor-pointer hover:shadow-medium transition-all duration-300"
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                              {getInitials(patient.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                              <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                              <span>{patient.age} years</span>
                              <span>•</span>
                              <span>{patient.gender}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Activity className="h-3 w-3" />
                                <span>Last reading: {patient.lastReading}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Vitals Preview */}
                        <div className="flex items-center space-x-8 mr-4">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Heart Rate</div>
                            <div className="text-lg font-semibold text-foreground">{patient.vitals.heartRate} bpm</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">BP</div>
                            <div className="text-lg font-semibold text-foreground">{patient.vitals.bloodPressure}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Temp</div>
                            <div className="text-lg font-semibold text-foreground">{patient.vitals.temperature}°F</div>
                          </div>
                        </div>

                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No patients found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Patients;
