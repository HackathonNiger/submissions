import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonateButton } from "@/components/donate-button";
import { H2, P, H4 } from "../typograpy";
import { Button } from "../ui/button";
import { listCauses } from "@/actions";
import AnimatedCard from "./components/AnimatedCard";
import AnimatedHeader from "@/components/home/components/AnimatedHeader";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export async function UrgentCauses() {
  const allCauses = await listCauses();

  // Split urgent vs normal
  const now = new Date();
  const urgentCauses = allCauses.filter((cause) => {
    const createdAt = new Date(cause.created_at);
    const hoursSinceCreated =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const percentageRaised =
      cause.goal > 0 ? (cause.raised / cause.goal) * 100 : 0;

    return hoursSinceCreated <= 24 && percentageRaised >= 1;
  });

  const normalCauses = allCauses.filter(
    (cause) => !urgentCauses.includes(cause)
  );

  // Merge: urgent first, then the rest
  const combinedCauses = [...urgentCauses, ...normalCauses];

  if (combinedCauses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">No Causes Yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are currently no causes available. Check back later for new
          opportunities to make a difference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative py-12">
      <Carousel className="w-full">
        <div className="flex items-start justify-between w-full relative">
          <AnimatedHeader className="flex-1">
            <H2 className="text-black text-4xl font-bold font-['Montserrat'] leading-[48px] mb-2">
              Urgent Causes
            </H2>
            <P className="text-lg text-gray-500">
              Support critical causes that are gaining rapid momentum in their
              first hours. Your timely action can make the biggest difference
            </P>
          </AnimatedHeader>
          <div className="flex items-center gap-2 ml-4">
            <CarouselPrevious className="static translate-y-0 translate-x-0" />
            <CarouselNext className="static translate-y-0 translate-x-0" />
          </div>
        </div>
        <CarouselContent className="mt-6 mb-6 md:mr-4 md:ml-4">
          {combinedCauses.map((cause) => (
            <CarouselItem
              key={cause.id}
              className="md:pl-4 basis-[85%] sm:basis-[50%] md:basis-[33.33%]"
            >
              <Link href={`/causes/${cause.id}`} className="group block h-full">
                <AnimatedCard>
                  <Card className="overflow-hidden cursor-pointer transition hover:shadow-2xl shadow-lg h-full flex flex-col border border-gray-300">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={cause.image || "/placeholder.svg"}
                        alt={cause.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="flex flex-col flex-1 p-4">
                      <CardTitle>
                        <H4>{cause.title}</H4>
                        <P className="font-extralight">
                          {cause.profiles?.full_name || "Unknown"}
                        </P>
                      </CardTitle>
                      <hr className="border-t-2 border-gray-400" />
                      <div className="flex justify-between items-center pt-2 text-xs">
                        <P>Raised</P>
                        <P>
                          {cause.goal > 0
                            ? Math.round((cause.raised / cause.goal) * 100)
                            : 0}
                          % • {cause.days_active} Days left
                        </P>
                      </div>
                    </CardHeader>
                    <div className="mt-auto w-full">
                      <CardContent>
                        <div className="space-y-2">
                          <Progress
                            value={(cause.raised / cause.goal) * 100}
                            className="h-2 bg-muted"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-between">
                          <span className="flex flex-col">
                            <H4>₦{cause.raised?.toLocaleString()}</H4>
                            <P className="font-light">
                              Funded of ₦{cause.goal?.toLocaleString()}
                            </P>
                          </span>
                          <span>
                            <DonateButton type="cause" disableLink />
                          </span>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                </AnimatedCard>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* View All Causes Button */}
      <div className="flex justify-center mt-6">
        <Link href="/causes">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-secondary/90 flex gap-2"
          >
            View More <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}
