import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface PatientVitals {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  bloodSugar: number;
  oxygenSaturation: number;
  lastUpdated: string;
}

interface RecentReading {
  date: string;
  time: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  status: string;
}

interface PatientData {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  deviceId: string;
  preferredHospital: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  currentVitals: PatientVitals;
  recentReadings: RecentReading[];
  lastReading: string;
  status: "normal" | "warning" | "critical";
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
  };
}

interface PatientsContextType {
  patients: PatientData[];
  addPatient: (patient: PatientData) => void;
  getPatientById: (id: string) => PatientData | undefined;
  updatePatientVitals: (id: string, vitals: Partial<PatientVitals>) => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

// Mock initial patients data
const mockPatients: PatientData[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "",
    age: 45,
    gender: "Male",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    bloodType: "O+",
    deviceId: "DEV-12345",
    preferredHospital: "City General Hospital",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
    },
    currentVitals: {
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      temperature: 98.6,
      bloodSugar: 95,
      oxygenSaturation: 98,
      lastUpdated: "2024-10-06T10:30:00",
    },
    recentReadings: [
      {
        date: "2024-10-06",
        time: "10:30 AM",
        heartRate: 72,
        bloodPressure: "120/80",
        temperature: 98.6,
        status: "normal",
      },
      {
        date: "2024-10-05",
        time: "09:15 AM",
        heartRate: 75,
        bloodPressure: "122/82",
        temperature: 98.4,
        status: "normal",
      },
      {
        date: "2024-10-04",
        time: "11:00 AM",
        heartRate: 78,
        bloodPressure: "125/85",
        temperature: 98.8,
        status: "normal",
      },
    ],
    lastReading: "2 hours ago",
    status: "normal",
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "",
    age: 52,
    gender: "Female",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    bloodType: "A-",
    deviceId: "DEV-12346",
    preferredHospital: "Metro Medical Center",
    emergencyContact: {
      name: "Mike Johnson",
      relationship: "Son",
      phone: "+1 (555) 876-5432",
    },
    currentVitals: {
      systolic: 145,
      diastolic: 92,
      heartRate: 88,
      temperature: 99.2,
      bloodSugar: 110,
      oxygenSaturation: 96,
      lastUpdated: "2024-10-06T08:15:00",
    },
    recentReadings: [
      {
        date: "2024-10-06",
        time: "08:15 AM",
        heartRate: 88,
        bloodPressure: "145/92",
        temperature: 99.2,
        status: "warning",
      },
    ],
    lastReading: "5 hours ago",
    status: "warning",
    vitals: {
      heartRate: 88,
      bloodPressure: "145/92",
      temperature: 99.2,
    },
  },
];

export const PatientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientData[]>(() => {
    const savedPatients = localStorage.getItem("patients");
    return savedPatients ? JSON.parse(savedPatients) : mockPatients;
  });

  const addPatient = (patient: PatientData) => {
    setPatients((prev) => {
      const updated = [...prev, patient];
      localStorage.setItem("patients", JSON.stringify(updated));
      return updated;
    });
  };

  const getPatientById = (id: string) => {
    return patients.find((patient) => patient.id === id);
  };

  const updatePatientVitals = (id: string, vitals: Partial<PatientVitals>) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id
          ? {
              ...patient,
              currentVitals: { ...patient.currentVitals, ...vitals, lastUpdated: new Date().toISOString() },
            }
          : patient
      )
    );
  };

  return <PatientsContext.Provider value={{ patients, addPatient, getPatientById, updatePatientVitals }}>{children}</PatientsContext.Provider>;
};

export const usePatients = (): PatientsContextType => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error("usePatients must be used within a PatientsProvider");
  }
  return context;
};
