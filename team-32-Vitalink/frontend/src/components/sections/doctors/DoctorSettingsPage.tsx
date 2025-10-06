import React, { useState } from "react";
import { useToast } from "../../ui/use-toast";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { DoctorSidebar } from "../../sidebars/DoctorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Label } from "../../ui/label";
import { Camera, Save } from "lucide-react";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { useUser } from "../../../contexts/UserContext";

const DoctorSettingsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { user } = useUser();

  if (!user) return null;

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    hospitalName: user?.hospitalName || "",
    hospitalAddress: user?.hospitalAddress || "",
    specialization: user?.specialization || user?.specs || "",
    experience: user?.experience || "",
    licenseNumber: user?.licenseNumber || user?.license || "",
  });

  // Update formData when user context changes (e.g. after signup)
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        hospitalName: user.hospitalName || "",
        hospitalAddress: user.hospitalAddress || "",
        specialization: user.specialization || user.specs || "",
        experience: user.experience || "",
        licenseNumber: user.licenseNumber || user.license || "",
      });
    }
  }, [user]);

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

  return (
    <SidebarProvider className="w-screen min-h-screen overflow-hidden h-full">
      <div className="flex w-full">
        <DoctorSidebar />
        <div className="flex-1">
          <header className="h-16 border-b bg-card flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold ml-4">Settings</h1>
          </header>

          <main className="p-6 sm:pr-0 pr-10 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your professional information and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-2xl">
                      {formData.firstName[0]}
                      {formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2 text-sm text-primary hover:underline">
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
                  <div className="grid md:grid-cols-2 gap-4">
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
                </div>

                <Separator />

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                    <Input id="hospitalName" value={formData.hospitalName} onChange={(e) => handleInputChange("hospitalName", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalAddress">Hospital/Clinic Address</Label>
                    <Textarea
                      id="hospitalAddress"
                      value={formData.hospitalAddress}
                      onChange={(e) => handleInputChange("hospitalAddress", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger>
                          <SelectValue />
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
                    <Input id="licenseNumber" value={formData.licenseNumber} onChange={(e) => handleInputChange("licenseNumber", e.target.value)} />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DoctorSettingsPage;
