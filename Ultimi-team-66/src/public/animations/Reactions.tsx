import Box from "@/components/ui/box";

export interface Reaction {
  emoji: string;
  name: string;
  category: 'positive' | 'negative' | 'neutral' | 'fun' | 'love' | 'surprise' | 'thinking';
  animation?: {
    type: 'lottie' | 'gif' | 'css' | 'sprite' | 'noto';
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

// Noto Emoji Animation helper function
const getNotoEmojiUrl = (emoji: string, format: 'webp' | 'gif' = 'webp'): string => {
  const codePoint = emoji.codePointAt(0)?.toString(16).toLowerCase().padStart(4, '0');
  return `https://googlefonts.github.io/noto-emoji-animation/animated/${codePoint}.${format}`;
};

export const reactions: Reaction[] = [
  // Positive reactions with Noto animations
  { 
    emoji: '👍', 
    name: 'thumbs up', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('👍'),
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '👏', 
    name: 'clap', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('👏'),
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '🙌', 
    name: 'raised hands', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🙌'),
      duration: 1800,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '💪', 
    name: 'strong', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('💪'),
      duration: 1200,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🔥', 
    name: 'fire', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🔥'),
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '⭐', 
    name: 'star', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('⭐'),
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  { 
    emoji: '✨', 
    name: 'sparkles', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('✨'),
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🎉', 
    name: 'party', 
    category: 'positive',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🎉'),
      duration: 3000,
      loop: false,
      autoplay: true
    },
    style: { width: '32px', height: '32px' }
  },

  // Love reactions with Noto animations
  { 
    emoji: '❤️', 
    name: 'red heart', 
    category: 'love',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('❤️'),
      duration: 1200,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px', scale: 1.2 }
  },
  { 
    emoji: '💖', 
    name: 'sparkling heart', 
    category: 'love',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('💖'),
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '💕', 
    name: 'two hearts', 
    category: 'love',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('💕'),
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '30px', height: '30px' }
  },

  // Fun reactions with Noto animations
  { 
    emoji: '😂', 
    name: 'joy', 
    category: 'fun',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('😂'),
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '🤣', 
    name: 'rolling on floor', 
    category: 'fun',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🤣'),
      duration: 3000,
      loop: false,
      autoplay: true
    },
    style: { width: '32px', height: '32px' }
  },
  { 
    emoji: '😆', 
    name: 'laughing', 
    category: 'fun',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('😆'),
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },

  // Thinking reactions with Noto animations
  { 
    emoji: '🤔', 
    name: 'thinking face', 
    category: 'thinking',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🤔'),
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '🧐', 
    name: 'monocle', 
    category: 'thinking',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🧐'),
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },

  // Surprise reactions with Noto animations
  { 
    emoji: '😮', 
    name: 'open mouth', 
    category: 'surprise',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('😮'),
      duration: 1000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🤯', 
    name: 'exploding head', 
    category: 'surprise',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🤯'),
      duration: 2500,
      loop: false,
      autoplay: true
    },
    style: { width: '30px', height: '30px' }
  },

  // Negative reactions with Noto animations
  { 
    emoji: '👎', 
    name: 'thumbs down', 
    category: 'negative',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('👎'),
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🤦', 
    name: 'facepalm', 
    category: 'negative',
    animation: {
      type: 'noto',
      source: getNotoEmojiUrl('🤦'),
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },

  // Neutral reactions (static fallback)
  { emoji: '😐', name: 'neutral face', category: 'neutral' },
  { emoji: '😑', name: 'expressionless', category: 'neutral' },
  { emoji: '🙂', name: 'slightly smiling', category: 'neutral' },
];

// Component to render animated emoji
export const AnimatedEmoji: React.FC<{
  reaction: Reaction;
  className?: string;
  onClick?: () => void;
}> = ({ reaction, className = '', onClick }) => {
  const { animation, style, emoji } = reaction;

  if (animation?.type === 'noto') {
    return (
      <Box as="img"
        src={animation.source}
        alt={reaction.name}
        className={className}
        style={{
          width: style?.width || '24px',
          height: style?.height || '24px',
          transform: style?.scale ? `scale(${style.scale})` : undefined,
          cursor: onClick ? 'pointer' : 'default',
          objectFit: 'contain'
        }}
        onClick={onClick}
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          // Fallback to static emoji if animation fails to load
          const target = e.target as HTMLElement;
          target.innerHTML = emoji;
        }}
      />
    );
  }

  // Fallback to static emoji for non-animated reactions
  return (
    <Box as="span"
      className={className}
      style={{
        fontSize: style?.width || '24px',
        transform: style?.scale ? `scale(${style.scale})` : undefined,
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-block'
      }}
      onClick={onClick}
    >
      {emoji}
    </Box>
  );
};

export const getReactionsByCategory = (category: Reaction['category']): Reaction[] => {
  return reactions.filter(reaction => reaction.category === category);
};

export const getRandomReactions = (count: number = 10): Reaction[] => {
  const shuffled = [...reactions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getPopularReactions = (): Reaction[] => {
  return reactions.slice(0, 10); // First 10 reactions as popular ones
};