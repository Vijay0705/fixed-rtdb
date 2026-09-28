import { User, GameResult, XpHistoryEntry, AuditLogEntry, RankTier } from '../types.js';

export function calculateRankTier(xp: number): RankTier {
  if (xp >= 150) return 'Legend';
  if (xp >= 79) return 'Nova';
  if (xp >= 39) return 'Blaze';
  return 'Spark';
}

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_vijay',
    email: 'ivijaysa@gmail.com',
    fullName: 'Vijay S (Admin)',
    gamerTag: 'Admin_Vijay',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    department: 'Esports Commission',
    studentId: 'ADM-2025-01',
    role: 'ADMIN',
    xp: 0,
    rankTier: 'Spark',
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    joinedAt: '2025-01-01'
  }
];

export const INITIAL_GAME_RESULTS: GameResult[] = [];

export const INITIAL_XP_HISTORY: XpHistoryEntry[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit_1',
    action: 'ADMIN_LOGIN',
    performedBy: 'ivijaysa@gmail.com',
    details: 'System initialized with zero student records. Ready for real participant registrations.',
    createdAt: new Date().toISOString()
  }
];

