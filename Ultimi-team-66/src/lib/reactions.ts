import { Reaction } from "@/lib/types";

export const reactions: Reaction[] = [
  // Positive reactions
  { 
    emoji: '👍', 
    name: 'thumbs up', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: '/animations/thumbs-up.json',
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
      type: 'lottie',
      source: '/animations/clap.json', // Fixed typo
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
      type: 'lottie',
      source: '/animations/raised-hands.json',
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
      type: 'lottie',
      source: 'flex-muscle',
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
      type: 'lottie',
      source: 'fire-flicker',
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
      type: 'lottie',
      source: 'star-twinkle',
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
      type: 'lottie',
      source: '/animations/sparkles.json',
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
      type: 'lottie',
      source: '/animations/party-popper.json',
      duration: 3000,
      loop: false,
      autoplay: true
    },
    style: { width: '32px', height: '32px' }
  },
  { 
    emoji: '🎊', 
    name: 'confetti', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: '/animations/confetti.json',
      duration: 2500,
      loop: false,
      autoplay: true
    },
    style: { width: '30px', height: '30px' }
  },
  { 
    emoji: '🚀', 
    name: 'rocket', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: '/animations/rocket-launch.json',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '💯', 
    name: 'hundred', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: 'hundred-bounce',
      duration: 1000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '✅', 
    name: 'check', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: '/animations/checkmark.json',
      duration: 1200,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🏆', 
    name: 'trophy', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: 'trophy-shine',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🎯', 
    name: 'target', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: 'target-hit',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '💎', 
    name: 'diamond', 
    category: 'positive',
    animation: {
      type: 'lottie',
      source: 'diamond-sparkle',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  // Love reactions
  { 
    emoji: '❤️', 
    name: 'red heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'heartbeat-pulse',
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
      type: 'lottie',
      source: '/animations/sparkling-heart.json',
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
      type: 'lottie',
      source: '/animations/floating-hearts.json',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '30px', height: '30px' }
  },
  { 
    emoji: '💗', 
    name: 'growing heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'growing-heart',
      duration: 1800,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '💘', 
    name: 'heart arrow', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: '/animations/cupid-arrow.json',
      duration: 2500,
      loop: false,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '💝', 
    name: 'heart gift', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'gift-unwrap',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '💞', 
    name: 'revolving hearts', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'revolving-hearts',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '💓', 
    name: 'beating heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'beating-heart',
      duration: 800,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '💙', 
    name: 'blue heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-blue',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '💚', 
    name: 'green heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-green',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '💛', 
    name: 'yellow heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-yellow',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🧡', 
    name: 'orange heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-orange',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '💜', 
    name: 'purple heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-purple',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🖤', 
    name: 'black heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-black',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🤍', 
    name: 'white heart', 
    category: 'love',
    animation: {
      type: 'lottie',
      source: 'color-pulse-white',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  // Fun reactions
  { 
    emoji: '😂', 
    name: 'joy', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: '/animations/laughing-tears.json',
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
      type: 'lottie',
      source: '/animations/rofl.json',
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
      type: 'lottie',
      source: 'laughing-bounce',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😄', 
    name: 'grinning', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'happy-wiggle',
      duration: 1200,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😃', 
    name: 'smiley', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'smile-glow',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😊', 
    name: 'blush', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'blush-fade',
      duration: 1800,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😁', 
    name: 'grin', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'grin-stretch',
      duration: 1000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🤩', 
    name: 'star struck', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: '/animations/star-eyes.json',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🥳', 
    name: 'partying face', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: '/animations/party-face.json',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '🤪', 
    name: 'zany face', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'crazy-spin',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😜', 
    name: 'winking tongue', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'wink-tongue',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😝', 
    name: 'squinting tongue', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'tongue-waggle',
      duration: 1200,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🤭', 
    name: 'hand over mouth', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'giggle-cover',
      duration: 1800,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🙃', 
    name: 'upside down', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'flip-upside-down',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😋', 
    name: 'yum', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'yum-lick',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  // Surprise reactions
  { 
    emoji: '😮', 
    name: 'open mouth', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'mouth-drop',
      duration: 1000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😯', 
    name: 'hushed', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'hushed-gasp',
      duration: 1200,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😲', 
    name: 'astonished', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: '/animations/shocked.json',
      duration: 1800,
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
      type: 'lottie',
      source: '/animations/mind-blown.json',
      duration: 2500,
      loop: false,
      autoplay: true
    },
    style: { width: '30px', height: '30px' }
  },
  { 
    emoji: '😱', 
    name: 'scream', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'scream-shake',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🙀', 
    name: 'scream cat', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'cat-shock',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😵', 
    name: 'dizzy face', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'dizzy-spin',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😳', 
    name: 'flushed', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'flush-blush',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🫨', 
    name: 'shaking face', 
    category: 'surprise',
    animation: {
      type: 'lottie',
      source: 'violent-shake',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  // Thinking reactions
  { 
    emoji: '🤔', 
    name: 'thinking face', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: '/animations/thinking-bubble.json',
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
      type: 'lottie',
      source: 'monocle-examine',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🤨', 
    name: 'raised eyebrow', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'eyebrow-raise',
      duration: 1000,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🤓', 
    name: 'nerd face', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'nerd-adjust-glasses',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '💭', 
    name: 'thought bubble', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'bubble-float',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🎭', 
    name: 'masks', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'mask-flip',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🔍', 
    name: 'magnifying glass', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'magnify-search',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  { 
    emoji: '💡', 
    name: 'light bulb', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: '/animations/lightbulb-moment.json',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🧠', 
    name: 'brain', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'brain-pulse',
      duration: 1800,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '⚡', 
    name: 'lightning', 
    category: 'thinking',
    animation: {
      type: 'lottie',
      source: 'lightning-flash',
      duration: 800,
      loop: false,
      autoplay: true
    },
    style: { width: '20px', height: '20px' }
  },
  // Negative reactions
  { 
    emoji: '👎', 
    name: 'thumbs down', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: '/animations/thumbs-down.json',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '😞', 
    name: 'disappointed', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'disappointed-sag',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😔', 
    name: 'pensive', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'pensive-nod',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😟', 
    name: 'worried', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'worried-tremble',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😕', 
    name: 'confused', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'confused-tilt',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🙁', 
    name: 'frowning', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'frown-droop',
      duration: 1200,
      loop: false,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😣', 
    name: 'persevering', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'persevere-strain',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😖', 
    name: 'confounded', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'confounded-squeeze',
      duration: 1800,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😫', 
    name: 'tired face', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'tired-droop',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😩', 
    name: 'weary', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'weary-sigh',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🤦', 
    name: 'facepalm', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: '/animations/facepalm.json',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '🤷', 
    name: 'shrug', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'shrug-shoulders',
      duration: 1500,
      loop: false,
      autoplay: true
    },
    style: { width: '28px', height: '28px' }
  },
  { 
    emoji: '😤', 
    name: 'huffing', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'huff-steam',
      duration: 1800,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😠', 
    name: 'angry', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'angry-red',
      duration: 1000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '😡', 
    name: 'rage', 
    category: 'negative',
    animation: {
      type: 'lottie',
      source: 'rage-shake',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  // Neutral reactions
  { emoji: '😐', name: 'neutral face', category: 'neutral' },
  { emoji: '😑', name: 'expressionless', category: 'neutral' },
  { emoji: '🙂', name: 'slightly smiling', category: 'neutral' },
  { emoji: '😶', name: 'no mouth', category: 'neutral' },
  { emoji: '🫤', name: 'diagonal mouth', category: 'neutral' },
  { emoji: '😒', name: 'unamused', category: 'neutral' },
  { emoji: '🤐', name: 'zipper mouth', category: 'neutral' },
  { emoji: '😬', name: 'grimacing', category: 'neutral' },
  { emoji: '🫥', name: 'dotted line face', category: 'neutral' },
  { emoji: '😪', name: 'sleepy', category: 'neutral' },
  // Additional fun reactions
  { 
    emoji: '🎪', 
    name: 'circus', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'circus-spin',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🎨', 
    name: 'art', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'paint-splash',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🎵', 
    name: 'music', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'music-note-float',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  { 
    emoji: '🎶', 
    name: 'musical notes', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'notes-dance',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🌟', 
    name: 'glowing star', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'star-glow-pulse',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  { 
    emoji: '🌈', 
    name: 'rainbow', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'rainbow-shimmer',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🦄', 
    name: 'unicorn', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'unicorn-magic',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '26px', height: '26px' }
  },
  { 
    emoji: '🎮', 
    name: 'video game', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'game-controller-wiggle',
      duration: 1500,
      loop: true,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🍕', 
    name: 'pizza', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'pizza-spin',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🍔', 
    name: 'burger', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'burger-bounce',
      duration: 1200,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🍰', 
    name: 'cake', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'cake-celebrate',
      duration: 2000,
      loop: false,
      autoplay: true
    },
    style: { width: '24px', height: '24px' }
  },
  { 
    emoji: '🍦', 
    name: 'ice cream', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'ice-cream-drip',
      duration: 3000,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  { 
    emoji: '☕', 
    name: 'coffee', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'coffee-steam',
      duration: 2500,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  },
  { 
    emoji: '🥤', 
    name: 'drink', 
    category: 'fun',
    animation: {
      type: 'lottie',
      source: 'drink-bubble',
      duration: 2000,
      loop: true,
      autoplay: true
    },
    style: { width: '22px', height: '22px' }
  }
];

export const getReactionsByCategory = (category: Reaction['category']): Reaction[] => {
  return reactions.filter(reaction => reaction.category === category);
};

export const getRandomReactions = (count: number = 10): Reaction[] => {
  const shuffled = [...reactions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getPopularReactions = (): Reaction[] => {
  return [
    { emoji: '❤️', name: 'red heart', category: 'love', animation: { type: 'lottie', source: 'heartbeat-pulse', duration: 1200, loop: true, autoplay: true }, style: { width: '24px', height: '24px', scale: 1.2 } },
    { emoji: '👍', name: 'thumbs up', category: 'positive', animation: { type: 'lottie', source: '/animations/thumbs-up.json', duration: 1500, loop: false, autoplay: true }, style: { width: '24px', height: '24px' } },
    { emoji: '😂', name: 'joy', category: 'fun', animation: { type: 'lottie', source: '/animations/laughing-tears.json', duration: 2500, loop: true, autoplay: true }, style: { width: '28px', height: '28px' } },
    { emoji: '🔥', name: 'fire', category: 'positive', animation: { type: 'lottie', source: 'fire-flicker', duration: 3000, loop: true, autoplay: true }, style: { width: '24px', height: '24px' } },
    { emoji: '👏', name: 'clap', category: 'positive', animation: { type: 'lottie', source: '/animations/clap.json', duration: 2000, loop: true, autoplay: true }, style: { width: '28px', height: '28px' } },
    { emoji: '🤔', name: 'thinking face', category: 'thinking', animation: { type: 'lottie', source: '/animations/thinking-bubble.json', duration: 2000, loop: true, autoplay: true }, style: { width: '28px', height: '28px' } },
    { emoji: '😮', name: 'open mouth', category: 'surprise', animation: { type: 'lottie', source: 'mouth-drop', duration: 1000, loop: false, autoplay: true }, style: { width: '26px', height: '26px' } },
    { emoji: '💯', name: 'hundred', category: 'positive', animation: { type: 'lottie', source: 'hundred-bounce', duration: 1000, loop: false, autoplay: true }, style: { width: '26px', height: '26px' } },
    { emoji: '🎉', name: 'party', category: 'positive', animation: { type: 'lottie', source: '/animations/party-popper.json', duration: 3000, loop: false, autoplay: true }, style: { width: '32px', height: '32px' } },
    { emoji: '👎', name: 'thumbs down', category: 'negative', animation: { type: 'lottie', source: '/animations/thumbs-down.json', duration: 1500, loop: false, autoplay: true }, style: { width: '24px', height: '24px' } }
  ];
};