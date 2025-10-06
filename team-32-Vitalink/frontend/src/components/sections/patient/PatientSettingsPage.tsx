import { useState } from "react";
import { Camera, Save, Link as LinkIcon } from "lucide-react";
import { useToast } from "../../ui/use-toast";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { useUser } from "../../../contexts/UserContext";
import { PatientSidebar } from "../../sidebars/PatientSidebar";

const PatientSettingsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeviceInput, setShowDeviceInput] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { user } = useUser();

  if (!user) return null;

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    preferredHospital: user?.preferredHospital || "",
    emergencyContact: user?.emergencyContact || "",
    deviceId: "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleConnectDevice = () => {
    if (!formData.deviceId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a device ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Device connected",
        description: `Device ${formData.deviceId} has been connected successfully.`,
      });
      setShowDeviceInput(false);
      setFormData((prev) => ({ ...prev, deviceId: "" }));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SidebarProvider className="w-screen min-h-screen overflow-hidden h-full">
      <div className="flex w-full">
        <PatientSidebar />
        <div className="flex-1">
          <header className="h-16 border-b bg-card flex items-center px-4 sm:px-6">
            <SidebarTrigger />
            <h1 className="text-xl sm:text-2xl font-bold ml-4">Settings</h1>
          </header>

          <main className="p-6 sm:pr-0 pr-10 max-w-4xl mx-auto">
            <div className="w-full mx-auto space-y-8">
              {/* Profile Settings */}
              <Card className="shadow-sm border border-border">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your personal information and preferences</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                    <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-2xl">{(formData.firstName?.[0] || "U") + (formData.lastName?.[0] || "")}</AvatarFallback>
                    </Avatar>

                    <div className="text-center sm:text-left">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-primary hover:underline">
                          <Camera className="h-4 w-4" />
                          <span>Change Avatar</span>
                        </div>
                      </Label>
                      <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF, max 5MB</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                      <Select value={formData.preferredHospital} onValueChange={(value) => handleInputChange("preferredHospital", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="city-general">City General Hospital</SelectItem>
                          <SelectItem value="metro-medical">Metro Medical Center</SelectItem>
                          <SelectItem value="university-hospital">University Hospital</SelectItem>
                          <SelectItem value="community-health">Community Health Clinic</SelectItem>
                          <SelectItem value="specialty-care">Specialty Care Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        placeholder="Contact name and phone"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              {/* Device Connection Section */}
              <Card className="shadow-sm border border-border">
                <CardHeader>
                  <CardTitle>Device Connection</CardTitle>
                  <CardDescription>Connect your health monitoring device to sync data</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {!showDeviceInput ? (
                    <Button onClick={() => setShowDeviceInput(true)} variant="outline" className="w-full">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Connect Device
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deviceId">Device ID</Label>
                        <Input
                          id="deviceId"
                          value={formData.deviceId}
                          onChange={(e) => handleInputChange("deviceId", e.target.value)}
                          placeholder="Enter your device ID"
                        />
                        <p className="text-xs text-muted-foreground">You can find the device ID on your device or in its manual</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleConnectDevice} disabled={isLoading} className="flex-1">
                          {isLoading ? "Connecting..." : "Connect"}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowDeviceInput(false);
                            setFormData((prev) => ({
                              ...prev,
                              deviceId: "",
                            }));
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PatientSettingsPage;
