'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filters } from './components/filters';
import { useDataFetch } from './hooks/useDataFetch';
import { useFilters } from './hooks/useFilters';
import { useConnect } from './hooks/useConnect';
import { useTheme } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LeaderboardTable } from '@/features/leaderboard/components';
import { useLeaderboardFilters } from '@/features/leaderboard/hooks';
import Head from "next/head";


const queryClient = new QueryClient();

export default function LeaderboardModule() {
  return (
    <QueryClientProvider client={queryClient}>
      <LeaderboardContent />
    </QueryClientProvider>
  );
}

function LeaderboardContent() {
  const { data, isLoading, sortOrder, setSortOrder } = useDataFetch();
  const { filters, setFilters, handlePageChange } = useFilters();
  const { handleConnect } = useConnect();
  const { theme } = useTheme();
  const itemsPerPage = 27;

  const filteredData = useLeaderboardFilters(data, filters)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <Head>
        <title>Leaderboard | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </Head>
      <Card className="mb-6 rounded-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
          <Filters
            setFilters={setFilters}
            filters={filters}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </CardHeader>
        <CardContent>
          <LeaderboardTable
            loading={isLoading}
            filteredData={filteredData}
            currentPage={filters.currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            setCurrentPage={handlePageChange}
            handleConnect={handleConnect}
            theme={theme}
          />
        </CardContent>
      </Card>
    </div>
  );
}