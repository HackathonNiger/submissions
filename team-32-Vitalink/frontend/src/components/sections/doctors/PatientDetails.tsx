// Doctor patient detail - detailed view of a patient
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Activity, Thermometer, Droplets, Phone, Mail, MapPin, User, Calendar, AlertCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { DoctorSidebar } from "../../sidebars/DoctorSidebar";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { usePatients } from "../../../contexts/PatientsContext";

const PatientDetail = () => {
  const { id } = useParams();
  const { getPatientById } = usePatients();

  const patient = getPatientById(id || "");

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Patient not found.</p>
      </div>
    );
  }

  const getVitalStatus = (value: number, type: string) => {
    if (type === "heartRate") {
      if (value >= 60 && value <= 100) return "normal";
      return "warning";
    }
    if (type === "temperature") {
      if (value >= 97 && value <= 99.5) return "normal";
      return "warning";
    }
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning":
        return "text-warning";
      case "normal":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
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
              <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 sm:pr-0 pr-10 max-w-5xl mx-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Patient Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h2 className="text-3xl font-bold text-foreground">{patient.name}</h2>
                          <Badge className="bg-success text-success-foreground">Active</Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>
                              {patient.age} years • {patient.gender}
                            </span>
                          </span>
                          <span>•</span>
                          <span>Blood Type: {patient.bloodType}</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{patient.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Current Vitals */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Vitals</CardTitle>
                      <CardDescription>Last updated: {new Date(patient.currentVitals.lastUpdated).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Blood Pressure</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {patient.currentVitals.systolic}/{patient.currentVitals.diastolic}
                        </div>
                        <div className="text-xs text-muted-foreground">mmHg</div>
                      </div>

                      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Activity className="h-4 w-4 text-pink-500" />
                          <span className="text-sm">Heart Rate</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(getVitalStatus(patient.currentVitals.heartRate, "heartRate"))}`}>
                          {patient.currentVitals.heartRate}
                        </div>
                        <div className="text-xs text-muted-foreground">bpm</div>
                      </div>

                      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">Temperature</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(getVitalStatus(patient.currentVitals.temperature, "temperature"))}`}>
                          {patient.currentVitals.temperature}
                        </div>
                        <div className="text-xs text-muted-foreground">°F</div>
                      </div>

                      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Blood Sugar</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">{patient.currentVitals.bloodSugar}</div>
                        <div className="text-xs text-muted-foreground">mg/dL</div>
                      </div>

                      <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Activity className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">O2 Saturation</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">{patient.currentVitals.oxygenSaturation}</div>
                        <div className="text-xs text-muted-foreground">%</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Readings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Readings</CardTitle>
                      <CardDescription>Last 3 vital sign measurements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {patient.recentReadings.map((reading, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{reading.date}</span>
                                  <span className="text-sm text-muted-foreground">{reading.time}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="text-foreground">HR: {reading.heartRate} bpm</span>
                                  <span className="text-foreground">BP: {reading.bloodPressure}</span>
                                  <span className="text-foreground">Temp: {reading.temperature}°F</span>
                                </div>
                              </div>
                              <Badge className="bg-success text-success-foreground">{reading.status}</Badge>
                            </div>
                            {index < patient.recentReadings.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emergency Contact & Device */}
                <div className="space-y-6">
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <span>Emergency Contact</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-semibold text-foreground">{patient.emergencyContact.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-semibold text-foreground">{patient.emergencyContact.phone}</div>
                      </div>
                      <Button variant="destructive" className="w-full mt-4">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Emergency Contact
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Connected Device</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Device ID</div>
                          <div className="font-mono text-sm text-foreground">{patient.deviceId}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                          <span className="text-sm text-success">Connected & Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PatientDetail;
