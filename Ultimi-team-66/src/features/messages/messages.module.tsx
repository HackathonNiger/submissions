'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '@/lib/types';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useConnectedUsers } from './hooks/useConnectedUsers';
import { useMessages } from './hooks/useMessages';
import { useSendMessage } from './hooks/useSendMessage';
import { useRealtimeMessages } from './hooks/useRealtimeMessages';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import { useSidebar } from './hooks/useSidebar';
import { ChatHeader } from './components/chat-header';
// import { ChatList } from './components/chat-list';
import { MessageList } from './components/message-list';
import { MessageInput } from './components/message-input';
import { toast } from 'sonner';
import  Box  from '@/components/ui/box';
import Head from "next/head";

export default function MessageModule() {
  const [chatMessage, setChatMessage] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  const isOnline = useOnlineStatus();
  const {
    currentUserId,
    chatUserId,
    chatUsername,
    chatUserAvatar,
    setChatUserId,
    setChatUsername,
    setChatUserAvatar,
  } = useCurrentUser();
  const { connectedUsers, isLoadingUsers } = useConnectedUsers(currentUserId, isOnline);
  const messages = useMessages(currentUserId, chatUserId, isOnline);
  const sendMessageMutation = useSendMessage(
    currentUserId,
    chatUserId,
    isOnline,
    setChatMessage,
    setReplyToMessage
  );

  const { showScrollDown, messagesEndRef, messageContainerRef, scrollToBottom } =
    useScrollBehavior(messages);

  const { setIsSidebarOpen } = useSidebar();
  const router = useRouter();

  useRealtimeMessages(
    currentUserId,
    chatUserId,
    isOnline,
    setChatUserId,
    setChatUsername,
    setChatUserAvatar
  );

  useEffect(() => {
    if (!chatUserId && connectedUsers.length > 0 && isOnline) {
      const mostRecentUser = connectedUsers[0];
      setChatUserId(mostRecentUser.id);
      setChatUsername(mostRecentUser.username);
      setChatUserAvatar(mostRecentUser.avatar_url);
      router.push(`/messages?userId=${mostRecentUser.id}`);
    }
  }, [connectedUsers, chatUserId, isOnline, router, setChatUserId, setChatUsername, setChatUserAvatar]);

  const handleSendMessage = () => {
    if (!currentUserId || !chatUserId || !chatMessage.trim() || !isOnline) {
      if (!isOnline) toast.error('Cannot send message: No internet connection.');
      return;
    }
    sendMessageMutation.mutate({
      content: chatMessage,
      parentMessageId: replyToMessage?.id || null,
      type: 'text',
    });
  };

  const handleReply = (message: Message) => {
    setReplyToMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserSelect = (userId: string, username: string, avatarUrl?: string) => {
    setChatUserId(userId);
    setChatUsername(username);
    setChatUserAvatar(avatarUrl);
    setReplyToMessage(null);
    router.push(`/messages?userId=${userId}`);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <Box as='div' className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full min-h-screen dark:bg-gray-900 relative">
      <Box as='main' className="flex flex-col h-screen w-full absolute">
        <Head>
        <title>Messages | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </Head>
        <ChatHeader
          chatUserId={chatUserId}
          chatUsername={chatUsername}
          chatUserAvatar={chatUserAvatar}
          isLoadingUsers={isLoadingUsers}
          connectedUsers={connectedUsers}
          handleUserSelect={handleUserSelect}
        />
        {/* <Box as='div' ref={sidebarRef}>
          <ChatList
            isLoadingUsers={isLoadingUsers}
            connectedUsers={connectedUsers}
            chatUserId={chatUserId}
            handleUserSelect={handleUserSelect}
          />
        </Box> */}
        <MessageList
          chatUserId={chatUserId}
          currentUserId={currentUserId}
          messages={messages}
          handleReply={handleReply}
          showScrollDown={showScrollDown}
          scrollToBottom={scrollToBottom}
          messageContainerRef={messageContainerRef}
          messagesEndRef={messagesEndRef}
        />
        <MessageInput
          chatUserId={chatUserId}
          currentUserId={currentUserId}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          replyToMessage={replyToMessage}
          setReplyToMessage={setReplyToMessage}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          isOnline={isOnline}
          sendMessageMutation={sendMessageMutation}
        />
      </Box>
    </Box>
  );
}