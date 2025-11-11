export interface Question {
  text: string;
  options: string[];
  correct: number;
  image: string;
}

export type QuizFormat = 'WAEC' | 'JAMB' | 'normal';



export type QuizScoreRow = {
  id: string;
  points: number;
  student_id: string;
  quiz_id: string;
  taken_at: string;
  exam_type: string;
  celebrated_bronze: boolean;
  celebrated_silver: boolean;
  celebrated_gold: boolean;
  celebrated_platinum: boolean;
  celebrated_diamond: boolean;
  celebrated_palladium: boolean;
};

export interface RawSender {
  id: string;
  username: string;
  avatar_url: string;
  user_type: string;
}
export interface RawMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  parent_message_id: string | null;
  created_at: string;
  is_read: boolean;
  sender?: RawSender[];
}

export interface LeaderboardEntry {
  student_id: string;
  username: string;
  exam_type: string;
  total_points: number;
  rank: number;
  avatar_url?: string;
}


export interface ConnectedUser {
  id: string;
  username: string;
  avatar_url?: string;
  user_type: 'student' | 'sponsor';
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  user_type: 'student' | 'sponsor';
}


export interface reaction{
  emoji: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  parent_message_id: string | null;
  created_at: string;
  is_read: boolean;
  sender?: Profile;
  type: string;
  avatar_url: string | null;
  is_deleted: boolean;
  // reactions: reaction[];
}


export interface Reaction {
  emoji: string;
  name: string;
  category: 'positive' | 'negative' | 'neutral' | 'fun' | 'love' | 'surprise' | 'thinking';
  animation?: {
    type: 'lottie' | 'gif' | 'css' | 'sprite';
    source: string;
    duration?: number;
    loop?: boolean;
    autoplay?: boolean;
  };
  style?: {
    width?: string;
    height?: string;
    scale?: number;
  };

}


export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string | null;
}

 export interface MessageListProps {
  chatUserId: string | null;
  currentUserId: string ;
  messages: Message[];
  handleReply: (message: Message) => void;
  showScrollDown: boolean;
  scrollToBottom: () => void;
  messageContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

 export interface ChatHeaderProps {
  chatUserId: string | null;
  chatUsername: string | null;
  chatUserAvatar: string | undefined;
  isLoadingUsers: boolean;
  connectedUsers: ConnectedUser[];
  handleUserSelect: (userId: string, username: string, avatarUrl?: string) => void;
}

 export interface QuizScore {
  points: number
  taken_at: string
}
 export interface CalendarDay {
  date: string
  count: number
}

export interface ActivityData {
  [key: string]: number
}

 export interface ActivityCalendarProps {
  activityData: ActivityData
  availableYears: number[]
  loading: boolean
  onYearChange: (year: number) => void
  selectedYear: number
}

export interface QuizScore {
  points: number
  taken_at: string
}


export interface QuizScore {
  points: number
  taken_at: string
}

export interface AggregatedData {
  labels: string[]
  dataValues: number[]
}