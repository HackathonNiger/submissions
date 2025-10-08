"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import StepPersonalDetails from "./StepPersonalDetails";
import StepDocumentUpload from "./StepDocumentUpload";
import StepProgress from "./StepProgress";
import StepSuccess from "./StepSuccess";
import { uploadKycDocument } from "@/actions/kyc-actions";
import { useAuth } from "@/hooks/use-auth";
import ProgressNav from "./components/ProgressNav";
import StepAddressDetails from "./StepAddressDetails";
import Image from "next/image";

const documentTypes = [
  "NIN",
  "BVN",
  "International Passport",
  "Driver's License",
  "Voter's Card",
];

export default function KycSetupPage() {
  const [step, setStep] = useState(0); // 0: Identity, 1: Address, 2: Upload, 3: Progress, 4: Success
  const [selectedDoc, setSelectedDoc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });
  const { user } = useAuth();
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Validation for identity details
  const validateIdentityDetails = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dobDay ||
      !formData.dobMonth ||
      !formData.dobYear ||
      !formData.phone
    ) {
      setError("Please fill in all identity details, including date of birth.");
      return false;
    }
    setError(null);
    return true;
  };

  // Validation for address details
  const validateAddressDetails = () => {
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postal ||
      !formData.country
    ) {
      setError("Please fill in all address details.");
      return false;
    }
    setError(null);
    return true;
  };

  // Validation for document upload
  const validateDocument = () => {
    if (!selectedDoc) {
      setError("Please select a document type.");
      return false;
    }
    if (!file) {
      setError("Please upload a document file.");
      return false;
    }
    setError(null);
    return true;
  };

  // Step 3: Upload to backend
  const handleUpload = async () => {
    setUploadError(null);
    if (!user) {
      setUploadError("You must be signed in to submit KYC.");
      setStep(4);
      return;
    }
    // Combine dob fields into YYYY-MM-DD
    const dob =
      formData.dobYear && formData.dobMonth && formData.dobDay
        ? `${formData.dobYear}-${String(formData.dobMonth).padStart(
            2,
            "0"
          )}-${String(formData.dobDay).padStart(2, "0")}`
        : "";
    try {
      const { documentUrl, error: uploadError } = await uploadKycDocument(
        user.id,
        file!,
        selectedDoc,
        {
          fullName: formData.firstName + " " + formData.lastName,
          dob: dob,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal: formData.postal,
          country: formData.country,
        }
      );
      if (uploadError) {
        setUploadError(uploadError);
        setStep(4);
        return;
      }
      setStep(4);
    } catch (err: any) {
      setUploadError(err.message || "Failed to submit KYC");
      setStep(4);
    }
  };

  // Only show ProgressNav for steps 0, 1, 2
  const showProgressNav = step <= 2;
  // Only pass completed steps for 3 steps
  const completedSteps = Array.from({ length: Math.min(step, 3) }, (_, i) => i);

  return (
    <div className="flex w-full h-screen bg-white">
      {/* Sidebar */}
      {showProgressNav && (
        <div className="w-[380px] border-r hidden md:block">
          <ProgressNav currentStep={step} completedSteps={completedSteps} />
        </div>
      )}
      <div className="flex-1 flex items-start md:px-10">
        <Card className="w-full h-full border-none shadow-none flex flex-col">
          <CardHeader>
            <CardTitle className="text-neutral-950 text-4xl font-bold font-montserrat">
              {step === 0 && "Upload a proof of your identity"}
              {step === 1 && "Address Information"}
              {step === 2 && "Upload your document"}
            </CardTitle>
            <CardDescription className="font-montserrat">
              {step === 0 &&
                "This helps us verify who you are and keep the platform safe for everyone."}
              {step === 1 &&
                "Enter your address details as they appear on your document."}
              {step === 2 && "Upload a valid document to verify your identity."}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow space-y-6 pb-32 overflow-auto">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 0 && (
              <StepPersonalDetails
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 1 && (
              <StepAddressDetails
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 2 && (
              <StepDocumentUpload
                selectedDoc={selectedDoc}
                setSelectedDoc={setSelectedDoc}
                file={file}
                setFile={setFile}
              />
            )}
            {step === 3 && <StepProgress onComplete={handleUpload} />}
            {step === 4 && (
              <>
                <StepSuccess />
                {uploadError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>

          {/* BOTTOM RIGHT BUTTONS - sticky to bottom of card */}
          <div className="mt-auto flex justify-end px-6 pb-8 gap-4 bg-white z-10 border-t border-neutral-100">
            {step > 0 && step < 3 && (
              <Button
                variant="outline"
                className="w-full h-12 text-sm px-6 md:w-64 md:h-16 md:px-10 md:text-md font-montserrat flex items-center gap-2"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            {step === 0 && (
              <Button
                className="w-full h-12 text-sm px-6 md:w-64 md:h-16 md:px-10 md:text-md bg-primaryShades-700 text-white font-semibold font-montserrat flex items-center gap-2"
                onClick={() => validateIdentityDetails() && setStep(1)}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {step === 1 && (
              <Button
                className="w-full h-12 text-sm px-6 md:w-64 md:h-16 md:px-10 md:text-md bg-primaryShades-700 text-white font-semibold font-montserrat flex items-center gap-2"
                onClick={() => validateAddressDetails() && setStep(2)}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {step === 2 && (
              <Button
                className="w-full h-12 text-sm px-6 md:w-64 md:h-16 md:px-10 md:text-md bg-primaryShades-700 text-white font-semibold font-montserrat flex items-center gap-2"
                onClick={() => validateDocument() && setStep(3)}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
