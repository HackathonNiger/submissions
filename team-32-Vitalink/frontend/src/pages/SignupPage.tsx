import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Stethoscope, User } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { FaHeartbeat } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { usePatients } from "../contexts/PatientsContext";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();
  const { addPatient } = usePatients();
  const [userType, setUserType] = useState(searchParams.get("type") || "patient");
  const [isLoading, setIsLoading] = useState(false);

  // Form state for patient info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredHospital, setPreferredHospital] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Generate avatar initials from first and last name
      const avatar = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

      // Set user data in contex
      if (userType === "patient") {
        const patientId = `P-${Date.now()}`;
        const patientData = {
          id: patientId,
          name: firstName + " " + lastName,
          avatar: avatar,
          age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
          gender: gender.charAt(0).toUpperCase() + gender.slice(1),
          email: email,
          phone: phone,
          address: "123 Main St, New York, NY 10001", // Default address, could be made configurable
          bloodType: "O+", // Default blood type, could be made configurable
          deviceId: `DEV-${patientId}`,
          preferredHospital: preferredHospital || "City General Hospital",
          emergencyContact: {
            name: emergencyContact.split(" ")[0] || "Emergency Contact",
            relationship: "Emergency Contact",
            phone: emergencyContact.split(" ").slice(1).join(" ") || phone,
          },
          currentVitals: {
            systolic: 120,
            diastolic: 80,
            heartRate: 72,
            temperature: 98.6,
            bloodSugar: 95,
            oxygenSaturation: 98,
            lastUpdated: new Date().toISOString(),
          },
          recentReadings: [
            {
              date: new Date().toISOString().split("T")[0],
              time: new Date().toLocaleTimeString(),
              heartRate: 72,
              bloodPressure: "120/80",
              temperature: 98.6,
              status: "normal",
            },
          ],
          lastReading: "Just now",
          status: "normal" as const,
          vitals: {
            heartRate: 72,
            bloodPressure: "120/80",
            temperature: 98.6,
          },
        };

        setUser({
          name: firstName + " " + lastName,
          patientId: `#${patientId}`,
          hospital: preferredHospital || "City General Hospital",
          doctor: "Dr. Sarah Johnson",
          avatar: avatar,
          username: firstName,
          specs: "",
          contact: "",
          address: "",
          license: "",
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          dateOfBirth: dateOfBirth,
          gender: gender,
          preferredHospital: preferredHospital,
          emergencyContact: emergencyContact,
        });

        // Add patient to patients context so doctors can see them
        addPatient(patientData);
      } else {
        setUser({
          patientId: "",
          hospital: hospitalName,
          doctor: "",
          name: firstName + " " + lastName,
          specs: specialization || "Cardiologist",
          avatar: avatar,
          contact: phone,
          address: hospitalAddress,
          username: firstName,
          license: license,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          experience: experience,
          hospitalName: hospitalName,
          hospitalAddress: hospitalAddress,
          specialization: specialization || "Cardiologist",
          licenseNumber: license,
        });
      }

      toast({
        title: "Account created successfully!",
        description: `Welcome to Vitalink as a ${userType}.`,
      });
      navigate(userType === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center absolute top-0 left-0 right-0 w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 bg-blue-50">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <Link to="/" className="inline-flex items-center mb-4 space-x-2 text-xl sm:text-2xl font-bold text-foreground">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              <span className="text-xl sm:text-2xl font-bold text-foreground">vitaLink</span>
            </div>
          </Link>
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Join our healthcare community today</p>
        </div>

        <Card className="shadow-strong border-0">
          <CardHeader className="pb-4 px-4 sm:px-6">
            <div className="flex justify-center space-x-2 sm:space-x-4 mb-6">
              <Button
                variant={userType === "patient" ? "default" : "outline"}
                onClick={() => setUserType("patient")}
                className="flex items-center space-x-2 text-sm sm:text-base"
              >
                <User className="h-4 w-4" />
                <span>Patient</span>
              </Button>
              <Button
                variant={userType === "doctor" ? "default" : "outline"}
                onClick={() => setUserType("doctor")}
                className="flex items-center space-x-2 text-sm sm:text-base"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Doctor</span>
              </Button>
            </div>
            <CardTitle className="text-center text-lg sm:text-xl">{userType === "doctor" ? "Doctor Registration" : "Patient Registration"}</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              {userType === "doctor"
                ? "Create your professional healthcare provider account"
                : "Join our patient community for better health management"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Common Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              {/* Doctor-specific Fields */}
              {userType === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                    <Input
                      id="hospitalName"
                      placeholder="City General Hospital"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalAddress">Hospital/Clinic Address</Label>
                    <Textarea
                      id="hospitalAddress"
                      placeholder="123 Medical Center Drive, City, State 12345"
                      value={hospitalAddress}
                      onChange={(e) => setHospitalAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select value={specialization} onValueChange={setSpecialization} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                          <SelectItem value="endocrinology">Endocrinology</SelectItem>
                          <SelectItem value="family-medicine">Family Medicine</SelectItem>
                          <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select value={experience} onValueChange={setExperience} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="4-7">4-7 years</SelectItem>
                          <SelectItem value="8-15">8-15 years</SelectItem>
                          <SelectItem value="16-25">16-25 years</SelectItem>
                          <SelectItem value="25+">25+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Medical License Number</Label>
                    <Input id="licenseNumber" placeholder="MD123456789" value={license} onChange={(e) => setLicense(e.target.value)} required />
                  </div>
                </>
              )}

              {/* Patient-specific Fields */}
              {userType === "patient" && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredHospital">Preferred Hospital/Clinic</Label>
                    <Select value={preferredHospital} onValueChange={setPreferredHospital} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your healthcare provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="City General Hospital">City General Hospital</SelectItem>
                        <SelectItem value="Metro Medical Center">Metro Medical Center</SelectItem>
                        <SelectItem value="University Hospital">University Hospital</SelectItem>
                        <SelectItem value="Community Health Clinic">Community Health Clinic</SelectItem>
                        <SelectItem value="Specialty Care Center">Specialty Care Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Contact name and phone"
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full h-10 sm:h-12 text-base sm:text-lg" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
