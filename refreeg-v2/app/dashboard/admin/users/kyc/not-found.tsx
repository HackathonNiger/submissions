import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <Alert variant="destructive">
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          The requested KYC review could not be found.
        </AlertDescription>
      </Alert>
    </div>
  );
} 