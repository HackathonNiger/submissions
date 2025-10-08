import { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "How It Works | Refreeg",
  description:
    "Learn how Refreeg connects donors with cause creators through our secure donation platform.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Create a Cause",
      description:
        "Cause creators can easily set up their fundraising campaigns on our platform, sharing their story and goals.",
      image: "/images/create-cause.svg",
    },
    {
      title: "Secure Donations",
      description:
        "Donors can contribute to causes they care about through our secure Paystack payment integration.",
      image: "/images/secure-donation.svg",
    },
    {
      title: "Direct Transfer",
      description:
        "We don't hold the funds - Paystack directly transfers donations to the cause creators' accounts.",
      image: "/images/direct-transfer.svg",
    },
    {
      title: "Transparent Process",
      description:
        "Every transaction is transparent and secure, with donors receiving confirmation of their contributions.",
      image: "/images/transparent.svg",
    },
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How Refreeg Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Refreeg is a transparent donation platform that connects donors
          directly with cause creators through secure payments.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>For Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <span>Browse and discover causes that matter to you</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Make secure donations through Paystack</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Receive instant confirmation of your donation</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Track the impact of your contributions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Cause Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <span>Create and share your cause with the world</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Receive donations directly to your Paystack account</span>
              </li>
              <li className="flex items-start gap-2">
                <span>No platform fees - keep 100% of donations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Engage with your donors and share updates</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
