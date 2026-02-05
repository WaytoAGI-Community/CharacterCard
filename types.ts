
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

// 新增：AI 计算后的状态变更指令
export interface EngineResult {
  storyNode: StoryNode;
  statUpdates: {
    credibility?: number; // 增量，例如 -1 或 +2
    stress?: number;
    connections?: number;
  };
  ruleUpdates: {
    add?: RuleCard[];
    removeIds?: string[];
  };
  isGameOver: boolean;
  gameSummary?: string; // 仅在 isGameOver 为 true 时存在
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
  turnCount: number; // 当前推进的时间线节点
  maxTurns: number;  // 预设的剧本长度
  finalSummary?: string;
}
