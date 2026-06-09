import { create } from 'zustand';
import { GameificationState, BadgeType, Badge, BADGES } from '../types/gamification';

const STORAGE_KEY = 'circuMetal-gamification';

// Load from localStorage with fallback
const loadFromStorage = (): Partial<GameificationState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save to localStorage
const saveToStorage = (state: Partial<GameificationState>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save gamification state');
  }
};

export const useGamificationStore = create<GameificationState>((set, get) => {
  const initialState = {
    badges: Object.values(BADGES),
    unlockedBadges: [],
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastAnalysisDate: null,
    totalAnalyses: 0,
    totalCircularAnalyses: 0,
    averageCircularityScore: 0,
    totalCarbonReduced: 0,
    rank: 1,
  };

  const stored = loadFromStorage();
  const startState = { ...initialState, ...stored };

  return {
    ...startState,

    addPoints: (points: number) => {
      set((state) => {
        const newState = {
          ...state,
          totalPoints: state.totalPoints + points,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    incrementStreak: () => {
      set((state) => {
        const today = new Date().toDateString();
        const lastDate = state.lastAnalysisDate
          ? new Date(state.lastAnalysisDate).toDateString()
          : null;

        let streak = state.currentStreak;
        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate === yesterday.toDateString()) {
            streak = state.currentStreak + 1;
          } else if (lastDate !== today) {
            streak = 1;
          }
        }

        const longestStreak = Math.max(streak, state.longestStreak);
        const newState = {
          ...state,
          currentStreak: streak,
          longestStreak,
          lastAnalysisDate: Date.now(),
        };
        saveToStorage(newState);
        return newState;
      });
    },

    resetStreak: () => {
      set((state) => {
        const newState = {
          ...state,
          currentStreak: 0,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    unlockBadge: (badgeId: BadgeType) => {
      set((state) => {
        if (state.unlockedBadges.includes(badgeId)) {
          return state;
        }

        const newUnlocked = [...state.unlockedBadges, badgeId];
        const newState = {
          ...state,
          unlockedBadges: newUnlocked,
          totalPoints: state.totalPoints + 100, // Bonus points for badge
        };
        saveToStorage(newState);
        return newState;
      });
    },

    recordAnalysis: (circularityScore: number, carbonReduction: number) => {
      set((state) => {
        const isCircular = circularityScore > 0.5;
        const totalAnalyses = state.totalAnalyses + 1;
        const totalCircularAnalyses = isCircular
          ? state.totalCircularAnalyses + 1
          : state.totalCircularAnalyses;

        const averageCircularityScore =
          (state.averageCircularityScore * state.totalAnalyses + circularityScore) /
          totalAnalyses;

        let points = 50; // Base points
        points += Math.round(circularityScore * 50); // Bonus for high circularity
        points += Math.round(Math.min(carbonReduction / 10, 50)); // Bonus for carbon reduction

        const newState = {
          ...state,
          totalAnalyses,
          totalCircularAnalyses,
          averageCircularityScore,
          totalCarbonReduced: state.totalCarbonReduced + carbonReduction,
          totalPoints: state.totalPoints + points,
        };

        // Check badge unlock conditions
        get().checkBadgeUnlock(newState);

        saveToStorage(newState);
        return newState;
      });
    },

    getProgress: (badgeId: BadgeType): { current: number; target: number } => {
      const state = get();

      switch (badgeId) {
        case 'first-analysis':
          return { current: Math.min(state.totalAnalyses, 1), target: 1 };
        case 'researcher':
          return { current: Math.min(state.totalAnalyses, 10), target: 10 };
        case 'circular-innovator':
          return {
            current: Math.min(state.totalCircularAnalyses, 5),
            target: 5,
          };
        case 'sustainability-expert':
          return {
            current: Math.min(state.totalAnalyses, 25),
            target: 25,
          };
        default:
          return { current: 0, target: 1 };
      }
    },

    reset: () => {
      const initialState = {
        badges: Object.values(BADGES),
        unlockedBadges: [],
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastAnalysisDate: null,
        totalAnalyses: 0,
        totalCircularAnalyses: 0,
        averageCircularityScore: 0,
        totalCarbonReduced: 0,
        rank: 1,
      };
      set(initialState);
      saveToStorage({});
    },

    // Private method for checking badge unlock conditions
    checkBadgeUnlock: (state: GameificationState) => {
      const baseState = get();

      if (
        state.totalAnalyses >= 1 &&
        !baseState.unlockedBadges.includes('first-analysis')
      ) {
        baseState.unlockBadge('first-analysis');
      }

      if (
        state.totalAnalyses >= 10 &&
        !baseState.unlockedBadges.includes('researcher')
      ) {
        baseState.unlockBadge('researcher');
      }

      if (
        state.totalCircularAnalyses >= 5 &&
        !baseState.unlockedBadges.includes('circular-innovator')
      ) {
        baseState.unlockBadge('circular-innovator');
      }

      if (
        state.totalAnalyses >= 25 &&
        state.averageCircularityScore > 0.7 &&
        !baseState.unlockedBadges.includes('sustainability-expert')
      ) {
        baseState.unlockBadge('sustainability-expert');
      }
    },
  };
});
