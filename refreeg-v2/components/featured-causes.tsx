import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { listCauses } from "@/actions";
import { DonateButton } from "@/components/donate-button";
import {
  GraduationCap,
  HeartPulse,
  Leaf,
  Users,
  AlertTriangle,
  PawPrint,
  Sparkles,
  Briefcase,
} from "lucide-react";

// Mock data for featured causes
// const featuredCauses = [
//   {
//     id: 1,
//     title: "Clean Water Initiative",
//     description: "Providing clean water to communities in rural areas.",
//     category: "Environment",
//     raised: 12500,
//     goal: 20000,
//     image: "/placeholder.svg?height=200&width=400",
//   },
//   {
//     id: 2,
//     title: "Education for All",
//     description: "Supporting education for underprivileged children.",
//     category: "Education",
//     raised: 8700,
//     goal: 15000,
//     image: "/placeholder.svg?height=200&width=400",
//   },
//   {
//     id: 3,
//     title: "Medical Supplies Drive",
//     description: "Collecting medical supplies for local clinics.",
//     category: "Healthcare",
//     raised: 5300,
//     goal: 10000,
//     image: "/placeholder.svg?height=200&width=400",
//   },
// ]

export async function FeaturedCauses() {
  const featuredCauses = await listCauses();

  const categoriesWithIcons = [
    {
      id: "education",
      name: "Education",
      icon: <GraduationCap className="mr-1 h-4 w-4" />,
    },
    {
      id: "health",
      name: "Healthcare",
      icon: <HeartPulse className="mr-1 h-4 w-4" />,
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Leaf className="mr-1 h-4 w-4" />,
    },
    {
      id: "community",
      name: "Community",
      icon: <Users className="mr-1 h-4 w-4" />,
    },
    {
      id: "disaster",
      name: "Disaster Relief",
      icon: <AlertTriangle className="mr-1 h-4 w-4" />,
    },
    {
      id: "animals",
      name: "Animal Welfare",
      icon: <PawPrint className="mr-1 h-4 w-4" />,
    },
    {
      id: "creative",
      name: "Creative",
      icon: <Sparkles className="mr-1 h-4 w-4" />,
    },
    {
      id: "business",
      name: "Business",
      icon: <Briefcase className="mr-1 h-4 w-4" />,
    },
  ];

  if (!featuredCauses || featuredCauses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
        <h3 className="text-lg font-semibold">No Causes Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are currently no causes available. Check back later for new
          opportunities to make a difference.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
      {featuredCauses.map((cause) => {
        // Find the category based on the cause's category id
        const category = categoriesWithIcons.find(
          (cat) => cat.id === cause.category
        );

        return (
          <Link key={cause.id} href={`/causes/${cause.id}`} className="group">
            <Card className="overflow-hidden cursor-pointer transition hover:shadow-lg h-full flex flex-col">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={cause.image || "/placeholder.svg"}
                  alt={cause.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader className="flex flex-col flex-1 p-4">
                <CardTitle className="font-medium text-base md:text-xl lg:text-2xl">
                  {cause.title}
                </CardTitle>
                {/* <CardDescription>
                  {cause.description.split(" ").length > 25
                    ? (
                        <>
                          {cause.description.split(" ").slice(0, 25).join(" ")}...{" "}
                          <span className="text-blue-600 group-hover:underline">see more</span>
                        </>
                      )
                    : cause.description}
                </CardDescription> */}
                <div className="flex items-center gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-full"
                  >
                    {category?.icon}
                    {category
                      ? category.name.charAt(0).toUpperCase() +
                        category.name.slice(1)
                      : "Unknown"}
                  </Badge>
                </div>
              </CardHeader>
              {/* This div will push itself to the bottom */}
              <div className="mt-auto w-full">
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        ₦{cause.raised.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ₦{cause.goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={(cause.raised / cause.goal) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <DonateButton />
                  </div>
                </CardFooter>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
