# State Management and Enhanced AI Engine

This project now includes state management with Zustand and an enhanced AI engine based on the implementation from [WaytoAGI-Community/LayoutForgeAI](https://github.com/WaytoAGI-Community/LayoutForgeAI).

## Features

### 1. State Management with Zustand

The game state is now managed using Zustand with localStorage persistence. This provides:

- **Automatic State Persistence**: Game progress is automatically saved to localStorage
- **State Restoration**: Game state is restored when the page is reloaded
- **Centralized State Management**: All game state is managed in one place
- **Performance**: Fine-grained selectors prevent unnecessary re-renders

#### Usage Example

```typescript
import { useCharacter, useSetCharacter } from './store';

function MyComponent() {
  const character = useCharacter();
  const setCharacter = useSetCharacter();
  
  // Use character state
  console.log(character?.name);
  
  // Update character
  setCharacter(newCharacter);
}
```

#### Available Hooks

**State Selectors:**
- `usePhase()` - Current game phase
- `useCharacter()` - Selected character
- `useRules()` - Active game rules
- `useStoryLog()` - Story history
- `useCurrentStory()` - Current story node
- `useRealityStats()` - Character stats (credibility, stress, connections)
- `useTurnCount()` - Current turn number
- `useMaxTurns()` - Maximum turns in game
- `useFinalSummary()` - Game over summary
- `useLoading()` - Loading state
- `useShowAiSettings()` - AI settings modal visibility
- `useProvider()` - Current AI provider ('gemini' or 'openai')
- `useGeminiKey()` - Gemini API key
- `useOpenaiConfig()` - OpenAI configuration

**State Actions:**
- `useSetPhase()` - Update game phase
- `useSetCharacter()` - Set selected character
- `useSetRules()` - Update game rules
- `useResetGame()` - Reset game to initial state
- `useStartNewGame()` - Start a new game with a character
- `useSetShowAiSettings()` - Toggle AI settings modal
- `useSetProvider()` - Set AI provider
- `useSetGeminiKey()` - Update Gemini API key
- `useSetOpenaiConfig()` - Update OpenAI configuration
- `useResetGame()` - Reset game to initial state
- `useStartNewGame()` - Start a new game with a character

### 2. Enhanced AI Engine

The AI engine provides robust JSON parsing and multi-provider support.

#### Key Features

1. **Multi-Level JSON Parsing**: Handles various AI response formats
   - Extracts JSON from code blocks (```json...```)
   - Parses direct JSON responses
   - Auto-repairs common JSON formatting errors
   - Finds and extracts JSON from mixed text responses

2. **Multi-Provider Support**: Works with both Gemini and OpenAI
   ```typescript
   const config = {
     provider: 'gemini',
     gemini: { apiKey: 'your-key' }
   };
   
   // Or use OpenAI
   const config = {
     provider: 'openai',
     openai: { 
       apiKey: 'your-key',
       model: 'gpt-4-turbo-preview'
     }
   };
   ```

3. **Structured JSON Output**: Enforces JSON schema for consistent responses
   ```typescript
   const result = await generateContent(config, {
     prompt: "Generate a story",
     systemInstruction: "You are a storyteller",
     jsonSchema: mySchema,
     jsonMode: true
   });
   ```

4. **Streaming Support**: For future real-time text generation
   ```typescript
   for await (const chunk of generateStream(config, request)) {
     console.log(chunk);
   }
   ```

#### Error Handling

The engine includes comprehensive error handling:
- Validates configuration before making requests
- Provides detailed error messages
- Auto-repairs malformed JSON
- Falls back gracefully on parsing failures

### 3. Migration from useState

The original implementation used React's `useState`. The new implementation uses Zustand, which provides:

**Before:**
```typescript
const [gameState, setGameState] = useState<GameState>({...});
```

**After:**
```typescript
const character = useCharacter();
const setCharacter = useSetCharacter();
const turnCount = useTurnCount();
```

**Benefits:**
- State persists across page reloads
- Better performance with selective re-renders
- Cleaner code with focused hooks
- Easier state debugging
- No prop drilling

## Implementation Details

### Store Configuration

The store is configured with persistence:
```typescript
export const gameStore = create<GameStoreState & GameStoreActions>()(
  persist(
    (set) => ({...}),
    {
      name: "character-card-game-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        phase: state.phase,
        character: state.character,
        // ... other game state
      })
    }
  )
);
```

### AI Engine Integration

The game service now uses the enhanced AI engine with configurable providers:
```typescript
// Build provider config from store
const providerConfig = {
  provider,
  gemini: geminiKey ? { apiKey: geminiKey } : undefined,
  openai: provider === 'openai' ? openaiConfig : undefined
};

// Pass config to AI engine
const result = await processTurn(
  character,
  activeRules,
  realityStats,
  choiceText,
  historySummary,
  turnCount,
  maxTurns,
  providerConfig
);
```

### AI Configuration UI

A settings modal component allows users to:
- Switch between Gemini and OpenAI providers
- Configure API keys and settings for each provider
- Persist configuration to localStorage
- Access settings from any game phase via gear icon button

The modal features:
- Dark fantasy themed UI matching the game aesthetic
- Conditional form fields based on selected provider
- Real-time provider switching
- Automatic configuration persistence

## Testing

The implementation has been tested for:
- ✅ State persistence and restoration
- ✅ JSON parsing with various formats
- ✅ AI configuration UI functionality
- ✅ Provider switching and configuration persistence
- ✅ Build compilation
- ✅ Code quality (code review passed)
- ✅ Security (CodeQL scan passed with 0 alerts)

## Future Enhancements

Potential improvements:
1. Add streaming for real-time story generation
2. Support for additional AI providers
3. State export/import for sharing game saves
4. Undo/redo functionality using state history
