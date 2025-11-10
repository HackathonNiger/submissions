import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Box from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import { ConnectedUser } from '@/lib/types';

interface ChatListProps {
  isLoadingUsers: boolean;
  connectedUsers: ConnectedUser[];
  chatUserId: string | null;
  handleUserSelect: (userId: string, username: string, avatarUrl?: string) => void;
}

export function ChatList({
  isLoadingUsers,
  connectedUsers,
  chatUserId,
  handleUserSelect,
}: ChatListProps) {
  return (
    <Box as="div" className="w-64 md:w-80 max-h-[90vh] overflow-y-auto p-0" >
      {isLoadingUsers ? (
        <Box className="p-4 space-y-4">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-14 w-full rounded-lg" />
          ))}
        </Box>
      ) : connectedUsers.length === 0 ? (
        <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
          No chats yet. Send a message to start one!
        </p>
      ) : (
        connectedUsers.map((user) => (
          <Box as="div"
            key={user.id}
            onClick={() =>
              handleUserSelect(user.id, user.username, user.avatar_url)
            }
            className={`cursor-pointer flex items-center gap-3 p-3 rounded-md
              ${
                chatUserId === user.id
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || ''} alt={user.username} />
              <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <Box as="div" className="flex-1">
              <Box as="div"className="flex items-center gap-2">
                <Box as="p"
                  className={`text-sm font-medium text-gray-900 dark:text-white ${
                    user.unreadCount > 0 ? 'font-bold' : ''
                  }`}
                >
                  {user.username}
                </Box>
                <Badge
                  className={`text-xs ${
                    user.user_type === 'student'
                      ? 'bg-blue-500 text-white'
                      : 'bg-purple-500 text-white'
                  }`}
                >
                  {user.user_type}
                </Badge>
              </Box>
              <Box as="p" className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.lastMessage ? user.lastMessage.split(' ').slice(0, 7).join(' ') + '...' || '' : ''}
              </Box>
            </Box>
            <Box as='div'>
              <Box/>
              {user.unreadCount > 0 && (
                <Badge className="bg-green-500 text-white text-xs">
                  {user.unreadCount}
                </Badge>
              )}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}
