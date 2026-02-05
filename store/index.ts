import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GameState, Phase, Character, RuleCard, StoryNode } from "../types";
import { INITIAL_RULES, INTRO_STORY } from "../constants";

const localStorageStorage = createJSONStorage(() => localStorage);

export interface GameStoreState extends GameState {
  loading: boolean;
}

export interface GameStoreActions {
  setPhase: (phase: Phase) => void;
  setCharacter: (character: Character | null) => void;
  setRules: (rules: RuleCard[] | ((prev: RuleCard[]) => RuleCard[])) => void;
  setStoryLog: (storyLog: StoryNode[] | ((prev: StoryNode[]) => StoryNode[])) => void;
  setCurrentStory: (story: StoryNode | null) => void;
  setRealityStats: (stats: GameState['realityStats'] | ((prev: GameState['realityStats']) => GameState['realityStats'])) => void;
  setTurnCount: (count: number) => void;
  setMaxTurns: (count: number) => void;
  setFinalSummary: (summary: string | undefined) => void;
  setLoading: (loading: boolean) => void;
  updateGameState: (updater: (prev: GameState) => Partial<GameState>) => void;
  resetGame: () => void;
  startNewGame: (character: Character) => void;
}

const initialState: GameStoreState = {
  phase: Phase.SELECTION,
  character: null,
  rules: INITIAL_RULES,
  storyLog: [],
  currentStory: null,
  realityStats: { credibility: 5, stress: 2, connections: 3 },
  turnCount: 0,
  maxTurns: 10,
  finalSummary: undefined,
  loading: false,
};

export const gameStore = create<GameStoreState & GameStoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      
      setPhase: (phase) => set({ phase }),
      
      setCharacter: (character) => set({ character }),
      
      setRules: (rules) =>
        set((state) => ({
          rules: typeof rules === 'function' ? rules(state.rules) : rules
        })),
      
      setStoryLog: (storyLog) =>
        set((state) => ({
          storyLog: typeof storyLog === 'function' ? storyLog(state.storyLog) : storyLog
        })),
      
      setCurrentStory: (story) => set({ currentStory: story }),
      
      setRealityStats: (stats) =>
        set((state) => ({
          realityStats: typeof stats === 'function' ? stats(state.realityStats) : stats
        })),
      
      setTurnCount: (count) => set({ turnCount: count }),
      
      setMaxTurns: (count) => set({ maxTurns: count }),
      
      setFinalSummary: (summary) => set({ finalSummary: summary }),
      
      setLoading: (loading) => set({ loading }),
      
      updateGameState: (updater) =>
        set((state) => {
          const updates = updater(state as GameState);
          return updates;
        }),
      
      resetGame: () =>
        set({
          phase: Phase.SELECTION,
          character: null,
          storyLog: [],
          currentStory: null,
          turnCount: 0,
          finalSummary: undefined,
          realityStats: { credibility: 5, stress: 2, connections: 3 },
          rules: INITIAL_RULES,
          loading: false,
        }),
      
      startNewGame: (character) =>
        set({
          phase: Phase.GAMEPLAY,
          character,
          currentStory: INTRO_STORY,
          storyLog: [INTRO_STORY],
          turnCount: 1,
          realityStats: { credibility: 5, stress: 2, connections: 3 },
          rules: INITIAL_RULES,
          finalSummary: undefined,
          loading: false,
        }),
    }),
    {
      name: "character-card-game-store",
      storage: localStorageStorage,
      // Persist game state but not loading state
      partialize: (state) => ({
        phase: state.phase,
        character: state.character,
        rules: state.rules,
        storyLog: state.storyLog,
        currentStory: state.currentStory,
        realityStats: state.realityStats,
        turnCount: state.turnCount,
        maxTurns: state.maxTurns,
        finalSummary: state.finalSummary,
      }),
    }
  )
);

// Convenience hooks for state access
export const usePhase = () => gameStore((s) => s.phase);
export const useCharacter = () => gameStore((s) => s.character);
export const useRules = () => gameStore((s) => s.rules);
export const useStoryLog = () => gameStore((s) => s.storyLog);
export const useCurrentStory = () => gameStore((s) => s.currentStory);
export const useRealityStats = () => gameStore((s) => s.realityStats);
export const useTurnCount = () => gameStore((s) => s.turnCount);
export const useMaxTurns = () => gameStore((s) => s.maxTurns);
export const useFinalSummary = () => gameStore((s) => s.finalSummary);
export const useLoading = () => gameStore((s) => s.loading);

export const useSetPhase = () => gameStore((s) => s.setPhase);
export const useSetCharacter = () => gameStore((s) => s.setCharacter);
export const useSetRules = () => gameStore((s) => s.setRules);
export const useSetStoryLog = () => gameStore((s) => s.setStoryLog);
export const useSetCurrentStory = () => gameStore((s) => s.setCurrentStory);
export const useSetRealityStats = () => gameStore((s) => s.setRealityStats);
export const useSetTurnCount = () => gameStore((s) => s.setTurnCount);
export const useSetMaxTurns = () => gameStore((s) => s.setMaxTurns);
export const useSetFinalSummary = () => gameStore((s) => s.setFinalSummary);
export const useSetLoading = () => gameStore((s) => s.setLoading);
export const useUpdateGameState = () => gameStore((s) => s.updateGameState);
export const useResetGame = () => gameStore((s) => s.resetGame);
export const useStartNewGame = () => gameStore((s) => s.startNewGame);
