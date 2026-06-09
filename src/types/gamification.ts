export type BadgeType = 
  | 'first-analysis' 
  | 'green-champion' 
  | 'researcher' 
  | 'optimizer' 
  | 'sustainability-expert'
  | 'circular-innovator'
  | 'data-master';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  requirement: string;
}

export interface GameificationState {
  // Badges
  badges: Badge[];
  unlockedBadges: BadgeType[];

  // Points & Streaks
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastAnalysisDate: number | null;

  // Statistics
  totalAnalyses: number;
  totalCircularAnalyses: number;
  averageCircularityScore: number;
  totalCarbonReduced: number;

  // Leaderboard (local)
  rank: number;

  // Actions
  addPoints: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockBadge: (badgeId: BadgeType) => void;
  recordAnalysis: (circularityScore: number, carbonReduction: number) => void;
  getProgress: (badgeId: BadgeType) => { current: number; target: number };
  reset: () => void;
}

// Badge definitions
export const BADGES: Record<BadgeType, Omit<Badge, 'unlockedAt'>> = {
  'first-analysis': {
    id: 'first-analysis',
    name: '🎯 First Analysis',
    description: 'Complete your first LCA analysis',
    icon: '🎯',
    requirement: 'Run 1 analysis',
  },
  'green-champion': {
    id: 'green-champion',
    name: '🌱 Green Champion',
    description: 'Achieve a circularity score above 0.75',
    icon: '🌱',
    requirement: 'Circularity score > 0.75',
  },
  'researcher': {
    id: 'researcher',
    name: '🔬 Researcher',
    description: 'Complete 10 analyses',
    icon: '🔬',
    requirement: '10 analyses',
  },
  'optimizer': {
    id: 'optimizer',
    name: '⚡ Optimizer',
    description: 'Reduce carbon footprint by 50% in a circular analysis',
    icon: '⚡',
    requirement: '50% carbon reduction',
  },
  'sustainability-expert': {
    id: 'sustainability-expert',
    name: '🌍 Sustainability Expert',
    description: 'Complete 25 analyses with an average circularity score > 0.7',
    icon: '🌍',
    requirement: '25 analyses, avg circularity > 0.7',
  },
  'circular-innovator': {
    id: 'circular-innovator',
    name: '♻️ Circular Innovator',
    description: 'Complete 5 circular process analyses',
    icon: '♻️',
    requirement: '5 circular analyses',
  },
  'data-master': {
    id: 'data-master',
    name: '📊 Data Master',
    description: 'Analyze all available materials',
    icon: '📊',
    requirement: 'Analyze all materials',
  },
};
