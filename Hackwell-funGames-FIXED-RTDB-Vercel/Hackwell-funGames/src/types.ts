export type RankTier = 
  | 'Spark' 
  | 'Blaze' 
  | 'Nova' 
  | 'Legend';

export type UserRole = 'student' | 'participant' | 'admin' | 'ADMIN';

export type EventGame = 
  | 'Chess' 
  | 'UNO' 
  | 'Drawasourous / Scribble.io' 
  | 'Among Us' 
  | 'Antakshiri' 
  | 'Dumb Charades' 
  | 'Guess the PIN'
  | 'Free Fire / BGMI';

export interface User {
  id: string;
  googleId?: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  gamerTag: string;
  avatar: string;
  department: string;
  teamName?: string;
  studentId: string;
  role: UserRole;
  xp: number;
  rankTier: RankTier;
  gamesPlayed: number;
  wins: number;
  losses: number;
  joinedAt: string;
}

export interface GameResult {
  id: string;
  userId: string;
  userGamerTag: string;
  userFullName: string;
  game: EventGame;
  result: 'WIN' | 'LOSS' | 'CORRECT WITHIN TIME' | 'WRONG' | 'TIMEOUT';
  moviesWon?: number;
  xpAwarded: number;
  isVoided: boolean;
  voidReason?: string;
  recordedByAdmin: string;
  createdAt: string;
}

export interface XpHistoryEntry {
  id: string;
  userId: string;
  userGamerTag: string;
  game: string;
  result: string;
  amount: number;
  performedBy: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'ADMIN_LOGIN' | 'XP_UPDATE' | 'RESULT_CORRECTION' | 'RESULT_VOID' | 'GAME_STATUS_UPDATE' | 'PASSWORD_RESET';
  performedBy: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface GameInfo {
  id: string;
  name: EventGame;
  category: string;
  description: string;
  rules: string[];
  xpRule: string;
  winXpText: string;
  banner: string;
}

export interface LeaderboardUser extends User {
  rank: number;
}
