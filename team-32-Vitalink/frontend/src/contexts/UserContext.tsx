import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface VitalData {
  name: string;
  value: number | string;
  unit?: string;
}

interface UserData {
  name: string;
  patientId: string;
  hospital: string;
  doctor: string;
  avatar: string;
  username: string;
  contact: string;
  specs: string;
  address: string;
  license: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredHospital?: string;
  emergencyContact?: string;
  experience?: string;
  hospitalName?: string;
  hospitalAddress?: string;
  specialization?: string;
  licenseNumber?: string;
  vitals?: VitalData[];
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateVitals: (vitals: VitalData[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (user: UserData | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  // ✅ Update vitals in context and persist them
  const updateVitals = (vitals: VitalData[]) => {
    setUserState((prev) => {
      if (!prev) return prev; // no user yet
      const updated = { ...prev, vitals };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateVitals }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
