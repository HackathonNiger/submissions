import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function StepSuccess() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
      <Image src="/kyc_sidenav.png" alt="Success" width={400} height={400} />
      <h1 className="text-4xl font-bold font-montserrat mb-2">
        All done you checked out!
      </h1>
      <p className="text-base font-montserrat mb-10">
        Thanks for verifying your identity — we will review your submission and
        get back to you shortly.
      </p>
      <Link href="/dashboard">
        <Button className="flex w-64 h-16 px-20 py-5 bg-primaryShades-700 text-white font-normal font-montserrat text-xl items-center gap-2">
          Proceed
          <ArrowRight className="w-12 h-12 scale-x-150" />
        </Button>
      </Link>
    </div>
  );
}
