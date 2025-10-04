import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple demo logic - determine user type by email
    const isDoctor = email.includes("doctor") || email.includes("dr") || email.includes("@hospital");

    // Simulate fetching user data
    setTimeout(() => {
      if (isDoctor) {
        setUser(null); // For doctor, can extend later
      } else {
        setUser({
          name: "John Doe",
          patientId: "#P-2024-001247",
          hospital: "City General Hospital",
          doctor: "Dr. Sarah Johnson",
        });
      }
      navigate(isDoctor ? "/doctor/dashboard" : "/patient/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-hero bg-blue-50 w-[100vw]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center mb-4 space-x-2 text-2xl font-bold text-foreground">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-foreground">vitaLink</span>
            </div>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your healthcare account</p>
        </div>

        <Card className="border-0 shadow-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[2.5rem] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full h-[2.5rem] rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Input id="remember" type="checkbox" className="w-4 h-4 accent-transparent rounded border-border text-primary focus:ring-primary" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
