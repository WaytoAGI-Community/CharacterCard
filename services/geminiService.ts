import { Type } from "@google/genai";
import { Character, RuleCard, EngineResult } from "../types";
import { generateContent, AIProviderConfig } from "./aiEngine";

const SYSTEM_PROMPT = `
You are the **Core Logic Engine** and **Narrative Director** for "Chronicles of the Persona".
Your role is to execute the game loop:
1. **Analyze Input**: Evaluate the player's choice against the current World State, Character Stats, and **Active Rules**.
2. **Apply Rules**: Check if any active rules (like "Murphy's Law" or "Equivalent Exchange") are triggered. 
   - If a rule triggers, you MUST apply its consequence (e.g., increase Stress, remove a resource).
   - You can also decide to ADD a new rule (e.g., "Wanted by Guards") or REMOVE an old one.
3. **Generate Output**: 
   - Write the narrative (Simplified Chinese).
   - Calculate numeric changes to stats (Stress, Credibility, Connections).
   - Determine if the game ends (Victory or Death).

**Current Reality Mapping (Stats):**
- **Credibility (信誉)**: < 3 means NPCs are hostile. 0 is Game Over (Exiled).
- **Stress (精神压力)**: > 7 means hallucinations/bad decisions. 10 is Game Over (Insanity).
- **Connections (人脉)**: Currency for help. 0 means isolation.

**Output Constraints:**
- Language: **Simplified Chinese (简体中文)** ONLY.
- Style: Dark Fantasy, Tarot aesthetics, Gritty.
- Structure: JSON matching the schema.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The narrative segment." },
    statUpdates: {
      type: Type.OBJECT,
      properties: {
        credibility: { type: Type.INTEGER, description: "Change amount, e.g., -1" },
        stress: { type: Type.INTEGER, description: "Change amount, e.g., +2" },
        connections: { type: Type.INTEGER, description: "Change amount, e.g., -1" }
      }
    },
    ruleUpdates: {
      type: Type.OBJECT,
      properties: {
        add: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['CONSTRAINT', 'BONUS', 'RISK', 'REALITY'] },
              description: { type: Type.STRING },
              active: { type: Type.BOOLEAN }
            }
          }
        },
        removeIds: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    isGameOver: { type: Type.BOOLEAN },
    gameSummary: { type: Type.STRING, description: "Only if isGameOver is true." },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          consequence: { type: Type.STRING },
          cost: { type: Type.STRING },
          risk: { type: Type.STRING }
        }
      }
    }
  }
};

export const processTurn = async (
  character: Character,
  activeRules: RuleCard[],
  realityStats: { credibility: number; stress: number; connections: number },
  lastChoiceText: string,
  historySummary: string,
  turnCount: number,
  maxTurns: number,
  providerConfig?: AIProviderConfig
): Promise<EngineResult> => {
  
  const isFinalTurn = turnCount >= maxTurns;

  const prompt = `
    [GAME STATE]
    Turn: ${turnCount} / ${maxTurns}
    Character: ${character.name} (${character.title}) - Weakness: ${character.weakness}
    Current Stats: Credibility=${realityStats.credibility}, Stress=${realityStats.stress}, Connections=${realityStats.connections}
    
    [ACTIVE RULES REGISTRY]
    ${activeRules.map(r => `(ID: ${r.id}) ${r.title}: ${r.description}`).join('\n')}
    
    [NARRATIVE CONTEXT]
    Story So Far: ${historySummary}
    **Player Action**: "${lastChoiceText}"
    
    [DIRECTIVES]
    1. Based on the player action and active rules, determine what happens next.
    2. Did any rule trigger? If "Murphy's Law" is active and they tried a complex plan, fail it.
    3. Update Stats: Did they get hurt? (Stress +). Did they offend someone? (Credibility -).
    4. **Rule Evolution**: If the story shifts significantly, you may Add a Rule (e.g., "Injury") or Remove one.
    5. ${isFinalTurn ? "This is the CLIMAX. Ignore choices generation. Set 'isGameOver': true and provide a 'gameSummary'." : "Generate 3 distinct choices for the next step."}
  `;

  const config: AIProviderConfig = providerConfig || {
    provider: 'gemini',
    gemini: {
      apiKey: process.env.API_KEY
    }
  };

  try {
    const response = await generateContent(config, {
      prompt,
      systemInstruction: SYSTEM_PROMPT,
      jsonSchema: responseSchema,
      jsonMode: true
    });

    const json = JSON.parse(response);
    
    // Defensive coding for the frontend
    return {
        storyNode: {
            text: json.text || "迷雾笼罩...",
            choices: json.choices || []
        },
        statUpdates: json.statUpdates || {},
        ruleUpdates: {
            add: json.ruleUpdates?.add || [],
            removeIds: json.ruleUpdates?.removeIds || []
        },
        isGameOver: !!json.isGameOver,
        gameSummary: json.gameSummary
    };

  } catch (error) {
    console.error("Gemini Engine Error", error);
    return {
      storyNode: {
        text: "现实的织锦断裂了（AI 连接错误）。",
        choices: [{ id: 'retry', text: '试图修补现实', consequence: '重试' }]
      },
      statUpdates: {},
      ruleUpdates: {},
      isGameOver: false
    };
  }
};
