import { Suspense } from "react";
import { CausesList } from "@/components/causes-list";
import { CausesFilter } from "@/components/causes-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { categories } from "@/lib/categories";
import AdBanner from "@/components/AdBanner";
// Mock categories for filtering

export default async function CausesPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const params = await searchParams;
  const category = params.category || "all";
  const page = Number.parseInt(params.page || "1");
  const pageSize = 9;

  return (
    <div className="p-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore Causes</h1>
          <p className="text-muted-foreground">
            Discover and support causes that are making a difference.
          </p>
        </div>

        <CausesFilter categories={categories} selectedCategory={category} />

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(pageSize)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
            </div>
          }
        >
          <CausesList category={category} page={page} pageSize={pageSize} />
        </Suspense>
      </div>
    </div>
  );
}
