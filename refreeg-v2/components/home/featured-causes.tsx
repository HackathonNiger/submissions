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

export async function FeaturedCauses() {
  const featuredCauses = (await listCauses()).filter(
    (c) => (c.days_active ?? 0) > 0 && c.status !== ("expired" as any)
  );

  if (!featuredCauses || featuredCauses.length === 0) {
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
          <AnimatedHeader>
            <H2 className="text-black text-4xl font-bold font-['Montserrat'] leading-[48px] mb-2">
              Featured Causes
            </H2>
            <P className="text-lg text-gray-500">
              Explore causes raising funds for emergencies, communities, and
              opportunities.
            </P>
          </AnimatedHeader>
          <div className="flex items-center gap-2 ml-4">
            <CarouselPrevious className="static translate-y-0 translate-x-0" />
            <CarouselNext className="static translate-y-0 translate-x-0" />
          </div>
        </div>
        <CarouselContent className="mt-6 mb-6 md:mr-4 md:ml-4">
          {featuredCauses.map((cause) => {
            const percentFunded = cause.goal
              ? Math.min(Math.round((cause.raised / cause.goal) * 100), 100)
              : 0;

            return (
              <CarouselItem
                key={cause.id}
                className="md:pl-4 basis-[85%] sm:basis-[50%] md:basis-[33.33%]"
              >
                <Link
                  href={`/causes/${cause.id}`}
                  className="group block h-full"
                >
                  <AnimatedCard>
                    <Card className="overflow-hidden cursor-pointer transition hover:shadow-2xl shadow-lg h-[420px] flex flex-col border border-gray-300">
                      {/* Image */}
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={cause.image || "/placeholder.svg"}
                          alt={cause.title}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Content */}
                      <CardHeader className="flex flex-col flex-1 p-4">
                        <CardTitle>
                          <H4 className="line-clamp-2">{cause.title}</H4>
                          <P className="font-extralight truncate">
                            {cause.profiles?.full_name || "Unknown"}
                          </P>
                        </CardTitle>
                        <hr className="border-t-2 border-gray-400" />
                        <div className="flex justify-between items-center pt-2 text-xs">
                          <P>Raised</P>
                          <P>
                            {percentFunded}% • {Number(cause.days_active || 0)}{" "}
                            Days left
                          </P>
                        </div>
                      </CardHeader>

                      {/* Progress + Footer */}
                      <div className="mt-auto w-full">
                        <CardContent>
                          <div className="space-y-2">
                            <Progress
                              value={percentFunded}
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
                              <DonateButton
                                type="cause"
                                id={cause.id}
                                disableLink
                              />
                            </span>
                          </div>
                        </CardFooter>
                      </div>
                    </Card>
                  </AnimatedCard>
                </Link>
              </CarouselItem>
            );
          })}
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
