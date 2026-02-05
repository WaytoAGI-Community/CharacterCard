export enum Phase {
  SELECTION = 'SELECTION',
  LOADING = 'LOADING',
  GAMEPLAY = 'GAMEPLAY',
  GAME_OVER = 'GAME_OVER'
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  stats: {
    strength: number;
    wits: number;
    charm: number;
  };
  traits: string[];
  weakness: string;
}

export interface RuleCard {
  id: string;
  title: string;
  type: 'CONSTRAINT' | 'BONUS' | 'RISK' | 'REALITY';
  description: string;
  active: boolean;
  effect?: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  consequence: string; // Used for AI context
  cost?: string;
  risk?: string;
}

export interface StoryNode {
  text: string;
  choices: StoryChoice[];
  background?: string;
}

export interface GameState {
  phase: Phase;
  character: Character | null;
  rules: RuleCard[];
  storyLog: StoryNode[];
  currentStory: StoryNode | null;
  realityStats: {
    credibility: number;
    stress: number;
    connections: number;
  };
}