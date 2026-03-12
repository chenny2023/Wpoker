
export enum Tab {
  Lobby = 'lobby',
  Create = 'create',
  Events = 'events',
  Account = 'account',
  Game = 'game',
  SessionResult = 'session_result',
}

export interface PokerTable {
  id: string;
  stakes: string; // e.g., "0.5/1 USDT"
  type: 'NLH' | 'PLO';
  players: number;
  maxPlayers: number;
  avgPot: number;
  handsPerHour: number;
}

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  username: string;
  country: string;
  profit: number;
  avatarUrl: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'game_profit' | 'game_loss';
  amount: number;
  date: string;
  currency: 'USDT' | 'TON';
}
