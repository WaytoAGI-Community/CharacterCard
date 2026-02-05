import { Type } from "@google/genai";
import { Character, RuleCard, StoryNode } from "../types";
import { generateContent, CompletionRequest, AIConfig } from "./aiEngine";

const SYSTEM_PROMPT = `
You are the 'Game Director' and 'Narrative Engine' for a high-stakes, dark fantasy RPG called 'Chronicles of the Persona'.
Your goal is to generate the next story segment based on the player's character, current rules, and previous choice.

**IMPORTANT: ALL OUTPUT MUST BE IN SIMPLIFIED CHINESE (简体中文).**

### Directives:
1. **Narrative Style**: Gritty, atmospheric, medieval fantasy. Use sensory details (smell of rust, sound of rain). Write in Chinese.
2. **Character Agency**: The player's choice must matter. Reflect the consequences of their previous action immediately.
3. **Rule Integration**: Check the 'Active Rules'. If a rule says 'Magic costs HP', and the player uses magic, mention the physical toll in the text.
4. **Reality Mapping**: The player has 'Reality Stats' (Credibility, Stress).
   - High Stress (>7): Distort the narrative. Describe things that might not be there.
   - Low Credibility (<3): NPCs should be dismissive or hostile.
5. **Dynamic Rules**: You have the authority to propose a NEW rule or Modify an existing one if the story demands it. *Currently, just weave this into the narrative text.*

### Output Format:
Return a JSON object with:
- \`text\`: The story segment (approx 80-120 words) in Chinese.
- \`choices\`: Exactly 3 distinct options in Chinese.
   - \`text\`: Action description.
   - \`consequence\`: A hint at the immediate outcome.
   - \`risk\`: Potential downside (e.g., "高受伤风险", "社会污名").
   - \`cost\`: Resource cost (e.g., "-10 金币", "失去荣誉").

### Structure:
- The story is a "Sequence of 3 Acts". We are currently in the ongoing narrative loop.
- Every choice should lead to a "Consequence Chain".
`;

export const generateNextChapter = async (
  character: Character,
  activeRules: RuleCard[],
  lastChoice: string,
  history: string,
  aiConfig: AIConfig
): Promise<StoryNode> => {
  const prompt = `
    [CURRENT STATE]
    Character: ${character.name} (${character.title})
    Traits: ${character.traits.join(', ')}
    Weakness: ${character.weakness}
    
    [ACTIVE RULES]
    ${activeRules.filter(r => r.active).map(r => `- ${r.title}: ${r.description}`).join('\n')}
    
    [NARRATIVE CONTEXT]
    Previous Events: ${history}
    Player Action: "${lastChoice}"
    
    [TASK]
    Generate the next scene in Simplified Chinese. Make it impactful.
  `;

  try {
    const request: CompletionRequest = {
      prompt,
      systemInstruction: SYSTEM_PROMPT,
      jsonMode: true,
      jsonSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
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
      }
    };

    const responseText = await generateContent(aiConfig, request);
    const json = JSON.parse(responseText || "{}");
    
    // Safety sanitization to prevent "Objects are not valid as React child"
    // Sometimes the model might return a nested object for a field requested as string.
    const safeNode: StoryNode = {
        text: typeof json.text === 'string' ? json.text : "时间的迷雾遮蔽了细节...",
        choices: Array.isArray(json.choices) ? json.choices.map((c: any, index: number) => ({
            id: c.id ? String(c.id) : `choice_${index}`,
            text: typeof c.text === 'string' ? c.text : "未知行动",
            consequence: typeof c.consequence === 'string' ? c.consequence : "",
            cost: typeof c.cost === 'string' ? c.cost : (c.cost ? String(c.cost) : undefined),
            risk: typeof c.risk === 'string' ? c.risk : (c.risk ? String(c.risk) : undefined),
        })) : []
    };

    return safeNode;
  } catch (error) {
    console.error("Gemini Gen Error", error);
    return {
      text: "命运的丝线纠缠不清，先知保持沉默。",
      choices: [
        { id: 'retry', text: '尝试重新连接命运', consequence: '重试生成' }
      ]
    };
  }
};