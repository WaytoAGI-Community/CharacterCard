import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GameState, Phase } from "../types";
import { INITIAL_RULES } from "../constants";
import { ServiceProvider, OpenAIConfig } from "../services/aiEngine";

const localStorageStorage = createJSONStorage(() => localStorage);

// State that persists
export interface PersistedState {
  provider: ServiceProvider;
  geminiKey: string;
  openaiConfig: OpenAIConfig;
}

// Full app state (includes game state that doesn't persist)
export interface AppState extends PersistedState {
  gameState: GameState;
  loading: boolean;
}

export interface AppDispatch {
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
  setLoading: (loading: boolean | ((prev: boolean) => boolean)) => void;
  setProvider: (provider: ServiceProvider | ((prev: ServiceProvider) => ServiceProvider)) => void;
  setGeminiKey: (key: string | ((prev: string) => string)) => void;
  setOpenaiConfig: (config: OpenAIConfig | ((prev: OpenAIConfig) => OpenAIConfig)) => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  phase: Phase.SELECTION,
  character: null,
  rules: INITIAL_RULES,
  storyLog: [],
  currentStory: null,
  realityStats: { credibility: 5, stress: 2, connections: 3 }
};

const initialState: AppState = {
  gameState: initialGameState,
  loading: false,
  provider: 'gemini',
  geminiKey: '',
  openaiConfig: {
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4-turbo-preview'
  }
};

export const appStore = create<AppState & AppDispatch>()(
  persist(
    (set) => ({
      ...initialState,
      setGameState: (state) =>
        set((prev) => ({
          gameState: typeof state === 'function' ? (state as (prev: GameState) => GameState)(prev.gameState) : state
        })),
      setLoading: (loading) =>
        set((prev) => ({
          loading: typeof loading === 'function' ? (loading as (prev: boolean) => boolean)(prev.loading) : loading
        })),
      setProvider: (provider) =>
        set((prev) => ({
          provider: typeof provider === 'function' ? (provider as (prev: ServiceProvider) => ServiceProvider)(prev.provider) : provider
        })),
      setGeminiKey: (key) =>
        set((prev) => ({
          geminiKey: typeof key === 'function' ? (key as (prev: string) => string)(prev.geminiKey) : key
        })),
      setOpenaiConfig: (config) =>
        set((prev) => ({
          openaiConfig: typeof config === 'function' ? (config as (prev: OpenAIConfig) => OpenAIConfig)(prev.openaiConfig) : config
        })),
      resetGame: () => set({ gameState: initialGameState })
    }),
    {
      name: "character-card-store",
      storage: localStorageStorage,
      // Only persist AI provider settings, not game state
      partialize: (state) => ({
        provider: state.provider,
        geminiKey: state.geminiKey,
        openaiConfig: state.openaiConfig
      })
    }
  )
);

// Custom hooks for accessing state
export const useGameState = () => appStore((s) => s.gameState);
export const useSetGameState = () => appStore((s) => s.setGameState);
export const useLoading = () => appStore((s) => s.loading);
export const useSetLoading = () => appStore((s) => s.setLoading);
export const useProvider = () => appStore((s) => s.provider);
export const useSetProvider = () => appStore((s) => s.setProvider);
export const useGeminiKey = () => appStore((s) => s.geminiKey);
export const useSetGeminiKey = () => appStore((s) => s.setGeminiKey);
export const useOpenaiConfig = () => appStore((s) => s.openaiConfig);
export const useSetOpenaiConfig = () => appStore((s) => s.setOpenaiConfig);
export const useResetGame = () => appStore((s) => s.resetGame);
