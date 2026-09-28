import { GameInfo, RankTier } from '../types';

export const EVENT_GAMES: GameInfo[] = [
  {
    id: 'game_chess',
    name: 'Chess',
    category: 'Strategy & Mind',
    description: 'The classic 1v1 tactical board game testing foresight, positioning, and tactical mastery.',
    rules: [
      'Standard 10-minute rapid clock per player.',
      'Touch-move rule enforced by tournament referees.',
      'Winner is declared on Checkmate or opponent clock expiry.'
    ],
    xpRule: 'WIN: +50 XP | LOSS: 0 XP',
    winXpText: '+50 XP for Win',
    banner: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'game_uno',
    name: 'UNO',
    category: 'Card Strategy',
    description: 'The thrilling, fast-paced card matching game of draw cards, skips, reverses, and wild hands.',
    rules: [
      '4-player table elimination rounds.',
      'Must call "UNO" when holding exactly 1 card.',
      'First player to clear their hand takes the victory.'
    ],
    xpRule: 'WIN: +25 XP | LOSS: 0 XP',
    winXpText: '+25 XP for Win',
    banner: 'https://images.pexels.com/photos/12612258/pexels-photo-12612258.jpeg'
  },
  {
    id: 'game_drawasourous',
    name: 'Drawasourous / Scribble.io',
    category: 'Party & Creativity',
    description: 'Multi-player online drawing and word guessing competition testing speed and visual recognition.',
    rules: [
      'Round-robin 3-round drawing sessions.',
      'No letters or numbers allowed inside drawings.',
      'Highest cumulative score at round end earns the win.'
    ],
    xpRule: 'WIN: +10 XP | LOSS: 0 XP',
    winXpText: '+10 XP for Win',
    banner: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'game_amongus',
    name: 'Among Us',
    category: 'Social Deduction',
    description: 'Survive task execution or sabotage crewmates in the ultimate test of deduction and deception.',
    rules: [
      '10 players per lobby with 2 Impostors.',
      'Emergency meetings have 60-second discussion limit.',
      'Victorious side (Crewmates or Impostors) earn XP.'
    ],
    xpRule: 'WIN: +15 XP | LOSS: 0 XP',
    winXpText: '+15 XP for Win',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'game_antakshiri',
    name: 'Antakshiri',
    category: 'Music & Performance',
    description: 'Classic musical showdown where participants sing songs matching the opponent ending consonant.',
    rules: [
      '15-second response countdown per song.',
      'Songs cannot be repeated within the same round.',
      'Referee decision is final on song validity.'
    ],
    xpRule: 'WIN: +10 XP | LOSS: 0 XP',
    winXpText: '+10 XP for Win',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'game_dumb_charades',
    name: 'Dumb Charades',
    category: 'Acting & Stage',
    description: 'Silent dramatic pantomime where team members act out movie titles without spoken words.',
    rules: [
      'No vocal sounds, mouth movements, or gestures spelling letters.',
      '2 minutes time limit per movie title.',
      'Earns +5 XP per correctly guessed movie.'
    ],
    xpRule: '+5 XP per movie won',
    winXpText: '+5 XP / Movie',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'game_guessthepin',
    name: 'Guess the PIN',
    category: 'Memory & Speed',
    description: 'High-speed numeric codebreaking and memory challenge against the ticking timer.',
    rules: [
      'Crack the 4-digit combination in under 45 seconds.',
      'Correct within allowed time earns full XP.',
      'Time expiration or incorrect guess awards 0 XP.'
    ],
    xpRule: 'CORRECT WITHIN TIME: +10 XP | WRONG/TIMEOUT: 0 XP',
    winXpText: '+10 XP for Correct PIN',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'game_freefire_bgmi',
    name: 'Free Fire / BGMI',
    category: 'Battle Royale & Esports',
    description: 'High-octane mobile battle royale survival tournament testing tactical gunplay, team positioning, and reflexes.',
    rules: [
      'Squad or Solo tournament brackets with official tournament rules.',
      'Last player or team standing claims the Chicken Dinner / Booyah.',
      'Official referees log match rankings and points.'
    ],
    xpRule: 'WIN: +60 XP | LOSS: 0 XP',
    winXpText: '+60 XP for Win',
    banner: 'https://sajidztech.com/wp-content/uploads/2024/09/4260bc90-ab40-40df-9bea-12eb487cecb9_PUBG-Mobile-vs-Free-Fire.jpeg'
  }
];

export function calculateRankTier(xp: number): RankTier {
  if (xp >= 150) return 'Legend';
  if (xp >= 79) return 'Nova';
  if (xp >= 39) return 'Blaze';
  return 'Spark';
}
