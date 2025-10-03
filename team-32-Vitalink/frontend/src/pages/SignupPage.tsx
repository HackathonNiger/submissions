import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Heart, Stethoscope, User } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { FaHeartbeat } from "react-icons/fa";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState(
    searchParams.get("type") || "patient"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Account created successfully!",
        description: `Welcome to HealthCare Connect as a ${userType}.`,
      });
      navigate(
        userType === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center w-[100vw] min-h-screen p-4 bg-blue-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center mb-4 space-x-2 text-2xl font-bold text-foreground"
          >
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-foreground">
                vitaLink
              </span>
            </div>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Create Your Account
          </h1>
          <p className="text-muted-foreground">
            Join our healthcare community today
          </p>
        </div>

        <Card className="border-0 shadow-strong">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-6 space-x-4">
              <Button
                variant={userType === "patient" ? "default" : "outline"}
                onClick={() => setUserType("patient")}
                className={`flex items-center space-x-2 hover:bg-gray-50 ${
                  userType === "patient" ? "bg-blue-600 hover:bg-blue-500" : ""
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient</span>
              </Button>
              <Button
                variant={userType === "doctor" ? "default" : "outline"}
                onClick={() => setUserType("doctor")}
                className={`flex items-center space-x-2 hover:bg-gray-50 ${
                  userType === "doctor" ? "bg-blue-600 hover:bg-blue-500" : ""
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor</span>
              </Button>
            </div>
            <CardTitle className="text-center">
              {userType === "doctor"
                ? "Doctor Registration"
                : "Patient Registration"}
            </CardTitle>
            <CardDescription className="text-center">
              {userType === "doctor"
                ? "Create your professional healthcare provider account"
                : "Join our patient community for better health management"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {/* Doctor-specific Fields */}
              {userType === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                    <Input
                      id="hospitalName"
                      placeholder="City General Hospital"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalAddress">
                      Hospital/Clinic Address
                    </Label>
                    <Textarea
                      id="hospitalAddress"
                      placeholder="123 Medical Center Drive, City, State 12345"
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="endocrinology">
                            Endocrinology
                          </SelectItem>
                          <SelectItem value="family-medicine">
                            Family Medicine
                          </SelectItem>
                          <SelectItem value="internal-medicine">
                            Internal Medicine
                          </SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">
                            Orthopedics
                          </SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select required>
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
                    <Label htmlFor="licenseNumber">
                      Medical License Number
                    </Label>
                    <Input
                      id="licenseNumber"
                      placeholder="MD123456789"
                      required
                    />
                  </div>
                </>
              )}

              {/* Patient-specific Fields */}
              {userType === "patient" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredHospital">
                      Preferred Hospital/Clinic
                    </Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your healthcare provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="city-general">
                          City General Hospital
                        </SelectItem>
                        <SelectItem value="metro-medical">
                          Metro Medical Center
                        </SelectItem>
                        <SelectItem value="university-hospital">
                          University Hospital
                        </SelectItem>
                        <SelectItem value="community-health">
                          Community Health Clinic
                        </SelectItem>
                        <SelectItem value="specialty-care">
                          Specialty Care Center
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Contact name and phone"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
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
