// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { MoreHorizontal } from 'lucide-react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useRouter } from 'next/navigation';
// import { LeaderboardEntry } from '@/lib/types';
// import { cartoonAvatars } from '@/schema/dashboard/mock-data';

// interface TableContentProps {
//   loading: boolean;
//   filteredData: LeaderboardEntry[];
//   currentPage: number;
//   itemsPerPage: number;
//   handleConnect: (toUserId: string) => void;
//   theme: string | undefined;
// }

// export const TableContent: React.FC<TableContentProps> = ({
//   loading,
//   filteredData,
//   currentPage,
//   itemsPerPage,
//   handleConnect,
//   theme,
// }) => {
//   const router = useRouter();

//   const getRankColor = (rank: number | undefined) => {
//     if (rank === 1) return 'bg-[#DAA425] text-white';
//     if (rank === 2) return 'bg-[#C0C0C0] text-white';
//     if (rank === 3) return 'bg-amber-700 text-white';
//     return 'bg-gray-100 text-gray-800';
//   };

//   const getLeagueBadgeColor = (league: string): string => {
//     switch (league) {
//       case 'Diamond':
//         return 'bg-[#b9f2ff] text-[#1a3c34]';
//       case 'Platinum':
//         return 'bg-[#E5E4E2] text-[#1a1a1a]';
//       case 'Gold':
//         return 'bg-[#DAA425] text-[#1a1a1a]';
//       case 'Silver':
//         return 'bg-[#C0C0C0] text-[#1a1a1a]';
//       case 'Bronze':
//         return 'bg-[#CD7F32] text-[#1a1a1a]';
//       default:
//         return 'bg-[#c1c1bb] text-[#1a1a1a]';
//     }
//   };

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <>
//       {loading ? (
//         <div className="space-y-2">
//           {[...Array(5)].map((_, idx) => (
//             <Skeleton key={idx} className="h-10 w-full rounded-lg" />
//           ))}
//         </div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Rank</TableHead>
//               <TableHead>Username</TableHead>
//               <TableHead>Points</TableHead>
//               <TableHead>League</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedData.map((entry, idx) => {
//               const rank = startIndex + idx + 1;
//               const league =
//                 entry?.total_points >= 27300
//                   ? 'Platinum'
//                   : entry?.total_points >= 13300
//                   ? 'Diamond'
//                   : entry?.total_points >= 5300
//                   ? 'Gold'
//                   : entry?.total_points >= 1300
//                   ? 'Silver'
//                   : entry?.total_points >= 900
//                   ? 'Bronze'
//                   : 'Palladium';

//               return (
//                 <TableRow
//                   key={entry?.student_id}
//                   className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
//                   onClick={() => router.push(`/users/${entry?.student_id}`)}
//                 >
//                   <TableCell>
//                     <div
//                       className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(
//                         entry?.rank
//                       )}`}
//                     >
//                       {entry?.rank || rank}
//                     </div>
//                   </TableCell>
//                   <TableCell className="flex items-center gap-2">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage
//                         src={entry?.avatar_url || cartoonAvatars[idx % cartoonAvatars.length]}
//                         alt={entry?.username ?? ''}
//                       />
//                       <AvatarFallback>{entry?.username}</AvatarFallback>
//                     </Avatar>
//                     {entry.username}
//                   </TableCell>
//                   <TableCell>
//                     {entry?.total_points ?? 0}{' '}
//                     <span className="text-[12px]">{'𝙐𝙥'}</span>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={getLeagueBadgeColor(league)}>
//                       {league}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             router.push(`/users/${entry.student_id}`);
//                           }}
//                         >
//                           View
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             router.push(`/messages?userId=${entry.student_id}`);
//                           }}
//                         >
//                           Contact
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleConnect(entry.student_id);
//                           }}
//                         >
//                           Connect
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       )}
//     </>
//   );
// };


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { LeaderboardEntry } from '@/lib/types';
import { cartoonAvatars } from '@/schema/dashboard/mock-data';
import { useTheme } from 'next-themes';
import { useAuth } from '@/features/leaderboard/hooks';

interface TableContentProps {
  loading: boolean;
  filteredData: LeaderboardEntry[];
  currentPage: number;
  itemsPerPage: number;
  handleConnect: (toUserId: string) => void;
  theme: string | undefined;
}

export const TableContent: React.FC<TableContentProps> = ({
  loading,
  filteredData,
  currentPage,
  itemsPerPage,
  handleConnect,
}) => {
  const router = useRouter();
  const UserId = useAuth();
  const getRankColor = (rank: number | undefined) => {
    if (rank === 1) return 'bg-[#DAA425] text-white';
    if (rank === 2) return 'bg-[#C0C0C0] text-white';
    if (rank === 3) return 'bg-amber-700 text-white';
    return 'bg-gray-100 text-gray-800';
  };

  const getLeagueBadgeColor = (league: string): string => {
    switch (league) {
      case 'Diamond':
        return 'bg-[#b9f2ff] text-[#1a3c34]';
      case 'Platinum':
        return 'bg-[#E5E4E2] text-[#1a1a1a]';
      case 'Gold':
        return 'bg-[#DAA425] text-[#1a1a1a]';
      case 'Silver':
        return 'bg-[#C0C0C0] text-[#1a1a1a]';
      case 'Bronze':
        return 'bg-[#CD7F32] text-[#1a1a1a]';
      default:
        return 'bg-[#c1c1bb] text-[#1a1a1a]';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
     const { theme } = useTheme();

  const renderActions = (entry: LeaderboardEntry) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/users/${entry.student_id}`);
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/messages?userId=${entry.student_id}`);
          }}
        >
          Contact
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleConnect(entry?.student_id);
          }}
        >
          Connect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile-first card layout */}
      <div className="space-y-4 lg:hidden">
        {paginatedData.map((entry, idx) => {
          const rank = startIndex + idx + 1;
          const league =
            entry?.total_points >= 27300
              ? 'Platinum'
              : entry?.total_points >= 13300
              ? 'Diamond'
              : entry?.total_points >= 5300
              ? 'Gold'
              : entry?.total_points >= 1300
              ? 'Silver'
              : entry?.total_points >= 900
              ? 'Bronze'
              : 'Palladium';

          return (
            <div
              key={entry?.student_id}
              className={`flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
              onClick={() => router.push(`/users/${entry?.student_id}`)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${getRankColor(
                    entry?.rank
                  )}`}
                >
                  {entry?.rank || rank}
                </div>
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src={entry?.avatar_url || cartoonAvatars[idx % cartoonAvatars.length]}
                    alt={entry?.username ?? ''}
                  />
                  <AvatarFallback>{entry?.username}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold text-lg truncate max-w-[150px]">{entry.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry?.total_points ?? 0}{' '}
                    <span className="text-[12px]">{'𝙐𝙥'}</span>
                  </p>
                  <Badge className={`mt-1 ${getLeagueBadgeColor(league)}`}>
                    {league}
                  </Badge>
                </div>
              </div>
              <div>{renderActions(entry)}</div>
            </div>
          );
        })}
      </div>

      {/* Standard table for larger screens */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>League</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((entry, idx) => {
              const rank = startIndex + idx + 1;
              const league =
                entry?.total_points >= 27300
                  ? 'Platinum'
                  : entry?.total_points >= 13300
                  ? 'Diamond'
                  : entry?.total_points >= 5300
                  ? 'Gold'
                  : entry?.total_points >= 1300
                  ? 'Silver'
                  : entry?.total_points >= 900
                  ? 'Bronze'
                  : 'Palladium';
                  const isCurrentUser = entry?.student_id === UserId;

              return (
                <TableRow
                  key={entry?.student_id}
                  // className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
                   className={`cursor-pointer ${
                          theme === 'custom'
                            ? 'hover:bg-blue-50'
                            : theme === 'light'
                            ? 'hover:bg-gray-100'
                            : 'hover:bg-gray-800'
                        } ${
                          isCurrentUser
                            ? theme === 'custom'
                              ? 'bg-blue-200'
                              : theme === 'light'
                              ? 'bg-blue-100'
                              : 'bg-blue-900'
                            : ''
                        }`}
                  onClick={() => router.push(`/users/${entry?.student_id}`)}
                >
                  <TableCell>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(
                        entry?.rank
                      )}`}
                    >
                      {entry?.rank || rank}
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={entry?.avatar_url || cartoonAvatars[idx % cartoonAvatars.length]}
                        alt={entry?.username ?? ''}
                      />
                      <AvatarFallback>{entry?.username}</AvatarFallback>
                    </Avatar>
                    {entry.username}
                  </TableCell>
                  <TableCell>
                    {entry?.total_points ?? 0}{' '}
                    <span className="text-[12px]">{'𝙐𝙥'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLeagueBadgeColor(league)}>
                      {league}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {renderActions(entry)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
