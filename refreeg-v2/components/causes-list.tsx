import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PaginationButton } from "@/components/pagination-button";
import { listCauses } from "@/actions";
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
import { ExpandableCard } from "./ExpandableCard";

// Mock data for causes
const mockCauses = [
  {
    id: "1",
    title: "Clean Water Initiative",
    description: "Providing clean water to communities in rural areas.",
    category: "environment",
    raised: 12500,
    goal: 20000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Education for All",
    description: "Supporting education for underprivileged children.",
    category: "education",
    raised: 8700,
    goal: 15000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-06-10T14:45:00Z",
  },
  {
    id: "3",
    title: "Medical Supplies Drive",
    description: "Collecting medical supplies for local clinics.",
    category: "health",
    raised: 5300,
    goal: 10000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-07-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Community Garden Project",
    description: "Creating a sustainable garden in our neighborhood.",
    category: "community",
    raised: 3200,
    goal: 5000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-07-10T11:30:00Z",
  },
  {
    id: "5",
    title: "Disaster Relief Fund",
    description: "Providing emergency aid to affected communities.",
    category: "disaster",
    raised: 15000,
    goal: 25000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-08-01T08:45:00Z",
  },
  {
    id: "6",
    title: "Animal Shelter Support",
    description: "Helping local animal shelters with supplies and care.",
    category: "animals",
    raised: 6800,
    goal: 12000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-08-15T13:20:00Z",
  },
  {
    id: "7",
    title: "Renewable Energy Project",
    description: "Installing solar panels in underserved communities.",
    category: "environment",
    raised: 9500,
    goal: 18000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-09-01T10:00:00Z",
  },
  {
    id: "8",
    title: "School Supplies Drive",
    description: "Collecting school supplies for children in need.",
    category: "education",
    raised: 4200,
    goal: 7500,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-09-10T15:30:00Z",
  },
  {
    id: "9",
    title: "Mental Health Awareness",
    description: "Promoting mental health awareness and support.",
    category: "health",
    raised: 7300,
    goal: 15000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-09-20T09:45:00Z",
  },
  {
    id: "10",
    title: "Neighborhood Cleanup",
    description: "Organizing community cleanup events.",
    category: "community",
    raised: 2100,
    goal: 4000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-10-01T14:15:00Z",
  },
  {
    id: "11",
    title: "Hurricane Relief",
    description: "Supporting families affected by recent hurricanes.",
    category: "disaster",
    raised: 18500,
    goal: 30000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-10-10T11:00:00Z",
  },
  {
    id: "12",
    title: "Wildlife Conservation",
    description: "Protecting endangered species and their habitats.",
    category: "animals",
    raised: 8900,
    goal: 20000,
    image: "/placeholder.svg?height=200&width=400",
    created_at: "2023-10-20T16:30:00Z",
  },
];

interface CausesListProps {
  category: string;
  page: number;
  pageSize: number;
}

export async function CausesList({
  category,
  page,
  pageSize,
}: CausesListProps) {
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

  const causes = await listCauses({
    category: category === "all" ? undefined : category,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  const filteredCauses =
    category === "all"
      ? causes
      : causes.filter((cause) => cause.category === category);

  const paginatedCauses = filteredCauses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalCauses = filteredCauses.length;
  const totalPages = Math.ceil(totalCauses / pageSize);

  if (paginatedCauses.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No causes found</h3>
        <p className="text-muted-foreground">
          Try selecting a different category or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔄 swap out old Shadcn cards */}
      <ExpandableCard
        items={paginatedCauses.map((cause) => ({
          ...cause,
          description: cause.description || "",
          raised: cause.raised,
          signatures: undefined,
        }))}
        type="cause"
      />

      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <PaginationButton currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
