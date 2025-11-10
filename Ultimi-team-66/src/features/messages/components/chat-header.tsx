// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import Box from '@/components/ui/box';
// import { Menu } from 'lucide-react';

// interface ChatHeaderProps {
//   chatUserId: string | null;
//   chatUsername: string | null;
//   chatUserAvatar: string | undefined;
//   setIsSidebarOpen: (open: boolean) => void;
// }

// export function ChatHeader({ chatUserId, chatUsername, chatUserAvatar, setIsSidebarOpen }: ChatHeaderProps) {
//   return (
//     <>
//       {chatUserId && (
//         <Box
//           as="div"
//           className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10"
//         >
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 aria-label="Open chats"
//                 className="relative z-10 left-[10px]"
//                 onClick={() => setIsSidebarOpen(true)}
//               >
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </DropdownMenuTrigger>
//           </DropdownMenu>
//           <Box as="div" className="flex items-center gap-3 max-w-4xl mx-auto w-full ml-[10px]">
//             <Avatar className="h-12 w-12">
//               <AvatarImage src={chatUserAvatar || ''} alt={chatUsername || 'User'} />
//               <AvatarFallback>{chatUsername?.[0] || 'U'}</AvatarFallback>
//             </Avatar>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{chatUsername || 'User'}</h2>
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// }

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Box from '@/components/ui/box';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { ChatList } from './chat-list';
import { ChatHeaderProps } from '@/lib/types';



export function ChatHeader({
  chatUserId,
  chatUsername,
  chatUserAvatar,
  isLoadingUsers,
  connectedUsers,
  handleUserSelect,
}: ChatHeaderProps) {
  return (
    <>
      {chatUserId && (
        <Box
          as="div"
          className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10"
        >
          {/* Sidebar with Menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open chats"
                className="relative z-10 left-[10px]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader>
                <SheetTitle className="p-4 text-lg font-semibold">
                  Chats
                </SheetTitle>
              </SheetHeader>
              <ChatList
                isLoadingUsers={isLoadingUsers}
                connectedUsers={connectedUsers}
                chatUserId={chatUserId}
                handleUserSelect={handleUserSelect}
              />
            </SheetContent>
          </Sheet>

          <Box as="div" className="flex items-center gap-3 max-w-4xl mx-auto w-full ml-[10px]">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chatUserAvatar || ''} alt={chatUsername || 'User'} />
              <AvatarFallback>{chatUsername?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {chatUsername || 'User'}
            </h2>
          </Box>
        </Box>
      )}
    </>
  );
}
