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
import { listPetitions } from "@/actions";
import { listSignaturesForPetition } from "@/actions/signature-actions";
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

export async function FeaturedPetitions() {
  const featuredPetitions = (await listPetitions()).filter(
    (p) => (p.days_active ?? 0) > 0 && p.status !== ("expired" as any)
  );


  // ✅ Fetch signers for each petition
  const petitionsWithSigners = await Promise.all(
    featuredPetitions.map(async (petition) => {
      const signers = await listSignaturesForPetition(petition.id);
      const percentSigned = Math.min(
        Math.round(((signers?.length || 0) / petition.goal) * 100),
        100
      );
      return { ...petition, signers, percentSigned };
    })
  );

  return (
    <div className="space-y-10 relative py-12">
      <Carousel className="w-full">
        <div className="flex items-start justify-between w-full relative">
          <AnimatedHeader>
            <H2 className="text-black text-4xl font-bold font-['Montserrat'] leading-[48px] mb-2">
              Featured Petitions
            </H2>
            <P className="text-lg text-gray-500">
              Explore petitions raising awareness and gathering support.
            </P>
          </AnimatedHeader>
          <div className="flex items-center gap-2 ml-4">
            <CarouselPrevious className="static translate-y-0 translate-x-0" />
            <CarouselNext className="static translate-y-0 translate-x-0" />
          </div>
        </div>

        <CarouselContent className="mt-6 mb-6 md:mr-4 md:ml-4">
          {petitionsWithSigners.map((petition) => (
            <CarouselItem
              key={petition.id}
              className="md:pl-4 basis-[85%] sm:basis-[50%] md:basis-[33.33%]"
            >
              <Link
                href={`/petitions/${petition.id}`}
                className="group block h-full"
              >
                <AnimatedCard>
                  <Card className="overflow-hidden cursor-pointer transition hover:shadow-2xl shadow-lg h-[420px] flex flex-col border border-gray-300 ">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={petition.image || "/placeholder.svg"}
                        alt={petition.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="flex flex-col flex-1 p-4 ">
                      <CardTitle>
                        <H4 className="line-clamp-2">{petition.title}</H4>
                        <P className="font-extralight">
                          {petition.profiles?.full_name || "Unknown"}
                        </P>
                      </CardTitle>
                      <hr className="border-t-2 border-gray-400" />
                      <div className="flex justify-between items-center pt-2 text-xs">
                        <P>Sign Now</P>
                        <P>
                          {petition.percentSigned}% •{" "}
                          {Number(petition.days_active || 0)} Days left
                        </P>
                      </div>
                    </CardHeader>
                    <div className="mt-auto w-full">
                      <CardContent>
                        <div className="space-y-2">
                          <Progress
                            value={petition.percentSigned}
                            className="h-2 bg-muted"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-between">
                          <span className="flex flex-col">
                            <H4>{petition.signers.length}</H4>
                            <P className="font-light">
                              Signed of {petition.goal?.toLocaleString()}
                            </P>
                          </span>
                          <span>
                            <DonateButton type="petition" disableLink />
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

      {/* View All Button */}
      <div className="flex justify-center mt-6">
        <Link href="/petitions">
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
