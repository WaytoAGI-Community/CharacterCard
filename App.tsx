import React, { useEffect, useRef } from 'react';
import { Phase, Character, EngineResult } from './types';
import { CHARACTERS } from './constants';
import CharacterCard from './components/CharacterCard';
import RuleCardComponent from './components/RuleCard';
import { processTurn } from './services/geminiService';
import {
  usePhase,
  useCharacter,
  useRules,
  useStoryLog,
  useCurrentStory,
  useRealityStats,
  useTurnCount,
  useMaxTurns,
  useFinalSummary,
  useLoading,
  useSetPhase,
  useSetCharacter,
  useSetRules,
  useSetStoryLog,
  useSetCurrentStory,
  useSetRealityStats,
  useSetTurnCount,
  useSetFinalSummary,
  useSetLoading,
  useResetGame,
  useStartNewGame,
} from './store';

const App: React.FC = () => {
  // Use zustand store instead of useState
  const phase = usePhase();
  const character = useCharacter();
  const rules = useRules();
  const storyLog = useStoryLog();
  const currentStory = useCurrentStory();
  const realityStats = useRealityStats();
  const turnCount = useTurnCount();
  const maxTurns = useMaxTurns();
  const finalSummary = useFinalSummary();
  const loading = useLoading();

  // Actions
  const setPhase = useSetPhase();
  const setCharacter = useSetCharacter();
  const setRules = useSetRules();
  const setStoryLog = useSetStoryLog();
  const setCurrentStory = useSetCurrentStory();
  const setRealityStats = useSetRealityStats();
  const setTurnCount = useSetTurnCount();
  const setFinalSummary = useSetFinalSummary();
  const setLoading = useSetLoading();
  const resetGame = useResetGame();
  const startNewGame = useStartNewGame();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of story log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [storyLog, currentStory, loading]);

  const handleCharacterSelect = (char: Character) => {
    setCharacter(char);
  };

  const handleStartGame = () => {
    if (!character) return;
    startNewGame(character);
  };

  const handleChoice = async (choiceId: string, choiceText: string) => {
    if (!character) return;
    
    setLoading(true);

    const historySummary = storyLog.map(n => n.text).join(' ').slice(-1000);
    
    // 1. EXECUTE ENGINE (Gemini)
    const result: EngineResult = await processTurn(
      character,
      rules.filter(r => r.active),
      realityStats,
      choiceText,
      historySummary,
      turnCount,
      maxTurns
    );

    setLoading(false);

    // 2. PROCESS STATE UPDATES
    // A. Update Stats
    const newStats = { ...realityStats };
    if (result.statUpdates.credibility) newStats.credibility += result.statUpdates.credibility;
    if (result.statUpdates.stress) newStats.stress += result.statUpdates.stress;
    if (result.statUpdates.connections) newStats.connections += result.statUpdates.connections;

    // Clamp values
    newStats.credibility = Math.max(0, Math.min(10, newStats.credibility));
    newStats.stress = Math.max(0, Math.min(10, newStats.stress));
    newStats.connections = Math.max(0, Math.min(10, newStats.connections));

    // B. Update Rules
    let newRules = [...rules];
    // Remove rules
    if (result.ruleUpdates.removeIds) {
        newRules = newRules.filter(r => !result.ruleUpdates.removeIds?.includes(r.id));
    }
    // Add rules
    if (result.ruleUpdates.add) {
        newRules = [...newRules, ...result.ruleUpdates.add];
    }

    // C. Check Critical Failures (Client-side guardrails in addition to AI)
    let isGameOver = result.isGameOver;
    let summary = result.gameSummary || "";

    if (newStats.stress >= 10) {
        isGameOver = true;
        summary = summary || "你的理智已经破碎。世界变成了一团无法理解的色彩和尖叫。";
    }
    if (newStats.credibility <= 0) {
        isGameOver = true;
        summary = summary || "你被彻底放逐。没有城市愿意为你打开大门。";
    }

    // D. Update all states
    setRealityStats(newStats);
    setRules(newRules);
    setCurrentStory(result.storyNode);
    setStoryLog(prev => [...prev, result.storyNode]);
    setTurnCount(turnCount + 1);
    
    if (isGameOver) {
      setPhase(Phase.GAME_OVER);
      setFinalSummary(summary);
    }
  };

  const restartGame = () => {
    resetGame();
  };

  // --- Render Functions ---

  const renderSelection = () => (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-8 bg-velvet-red relative overflow-y-auto">
        {/* Background Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,#000000_100%)] opacity-80 fixed"></div>
        
        <div className="z-10 text-center mb-12 mt-8 animate-float">
          <h1 className="text-5xl md:text-7xl font-bold text-gold-flow mb-4 drop-shadow-lg font-display">
            人格编年史
          </h1>
          <p className="text-paper text-lg font-serif italic opacity-80 max-w-2xl mx-auto border-b border-gold pb-4">
            "选择你的面具。这个世界的规则并非刻在石头上，而是由鲜血和抉择书写。"
          </p>
        </div>

        <div className="z-20 flex flex-col items-center gap-4 mb-12 sticky top-4">
            <button 
              disabled={!character}
              onClick={handleStartGame}
              className={`
                px-12 py-4 text-xl font-bold font-display tracking-widest uppercase transition-all duration-500
                border-2 border-gold relative overflow-hidden group shadow-2xl
                ${character 
                  ? 'bg-velvet-red text-gold shadow-[0_0_30px_#D4AF37] hover:scale-110' 
                  : 'bg-gray-900 text-gray-600 cursor-not-allowed border-gray-700'}
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                 {character ? `化身 ${character.name}` : '选择角色'}
                 <i className="fa-solid fa-scroll"></i>
              </span>
              <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            </button>
        </div>

        <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1600px] mb-20 px-4">
          {CHARACTERS.map(char => (
            <div key={char.id} className="flex justify-center">
               <CharacterCard 
                  character={char} 
                  isSelected={character?.id === char.id}
                  onSelect={handleCharacterSelect}
               />
            </div>
          ))}
        </div>
    </div>
  );

  const renderGameOver = () => (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>
          
          <div className="z-10 max-w-2xl text-center border-[6px] border-double border-gold p-12 bg-[#1a0f0f] shadow-[0_0_100px_rgba(139,0,0,0.5)] transform animate-fade-in-up">
              <h1 className="text-6xl font-display text-velvet-red mb-6 uppercase tracking-widest">
                  {turnCount >= maxTurns ? "命运终结" : "旅途崩坏"}
              </h1>
              <div className="w-full h-1 bg-gold mb-8"></div>
              
              <div className="mb-8 font-serif text-2xl text-paper italic leading-relaxed">
                  "{finalSummary || "你的故事在这里戛然而止..."}"
              </div>

              <div className="grid grid-cols-3 gap-8 mb-12 opacity-80">
                  <div className="flex flex-col">
                      <span className="text-stone-gray text-xs uppercase tracking-widest">最终信誉</span>
                      <span className="text-gold font-display text-3xl">{realityStats.credibility}</span>
                  </div>
                   <div className="flex flex-col">
                      <span className="text-stone-gray text-xs uppercase tracking-widest">精神残留</span>
                      <span className="text-gold font-display text-3xl">{10 - realityStats.stress}</span>
                  </div>
                   <div className="flex flex-col">
                      <span className="text-stone-gray text-xs uppercase tracking-widest">幸存回合</span>
                      <span className="text-gold font-display text-3xl">{turnCount}</span>
                  </div>
              </div>

              <button 
                  onClick={restartGame}
                  className="px-8 py-3 bg-gold text-black font-bold hover:bg-white transition-colors duration-300 font-display uppercase tracking-widest"
              >
                  轮回重置
              </button>
          </div>
      </div>
  );

  const renderGameplay = () => {
    if (!currentStory) return null;

    // Helper for Roman Numerals for Acts
    const romanTurn = (num: number) => {
        const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
        return roman[num - 1] || num;
    };

    return (
      <div className="min-h-screen w-full bg-[#1a0505] flex flex-col md:flex-row text-paper overflow-hidden">
        
        {/* LEFT COLUMN: Character & Stats (25%) */}
        <div className="hidden md:flex flex-col w-1/4 bg-[#0f0303] border-r-4 border-brown-600 p-6 relative shadow-2xl z-10">
          <div className="sticky top-6">
            <h2 className="text-gold font-display text-2xl mb-6 border-b border-brown pb-2 text-center">当前角色</h2>
            {character && (
               <div className="flex justify-center transform scale-75 origin-top mb-[-80px]">
                 <CharacterCard character={character} isSelected={true} />
               </div>
            )}
            
            <div className="mt-28">
                <h2 className="text-gold font-display text-xl mb-4 border-b border-brown pb-2">现实映射</h2>
                <div className="space-y-6 bg-brown-800/30 p-4 rounded-lg border border-brown">
                <div className="group">
                    <div className="flex justify-between mb-1 text-sm font-bold text-stone-gray">
                        <span><i className="fa-solid fa-scale-balanced mr-2"></i>信誉度</span> 
                        <span>{realityStats.credibility}/10</span>
                    </div>
                    <div className="w-full bg-[#2c1810] h-3 rounded-full overflow-hidden border border-brown-600">
                        <div className="bg-forest-green h-full transition-all duration-1000" style={{ width: `${realityStats.credibility * 10}%` }}></div>
                    </div>
                </div>
                <div className="group">
                    <div className="flex justify-between mb-1 text-sm font-bold text-stone-gray">
                        <span><i className="fa-solid fa-brain mr-2"></i>精神压力</span> 
                        <span>{realityStats.stress}/10</span>
                    </div>
                    <div className="w-full bg-[#2c1810] h-3 rounded-full overflow-hidden border border-brown-600">
                        <div className={`h-full transition-all duration-1000 ${realityStats.stress > 7 ? 'bg-red-600 animate-pulse' : 'bg-orange-700'}`} style={{ width: `${realityStats.stress * 10}%` }}></div>
                    </div>
                </div>
                 <div className="group">
                    <div className="flex justify-between mb-1 text-sm font-bold text-stone-gray">
                        <span><i className="fa-solid fa-handshake mr-2"></i>人脉</span> 
                        <span>{realityStats.connections}/10</span>
                    </div>
                    <div className="w-full bg-[#2c1810] h-3 rounded-full overflow-hidden border border-brown-600">
                        <div className="bg-blue-700 h-full transition-all duration-1000" style={{ width: `${realityStats.connections * 10}%` }}></div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Narrative (50%) */}
        <div className="flex-1 flex flex-col relative h-screen bg-paper/5">
          {/* Header Bar */}
          <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-20 flex justify-center items-center pointer-events-none">
             <span className="text-gold opacity-50 font-display tracking-[0.5em] text-sm">
                ACT {romanTurn(turnCount)} / {romanTurn(maxTurns)}
             </span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-16 scrollbar-hide scroll-smooth">
             {/* Story Log */}
             {storyLog.slice(0, -1).map((node, idx) => (
                <div key={idx} className="mb-12 opacity-50 text-base font-serif border-l-4 border-brown-600 pl-6 italic hover:opacity-100 transition-opacity">
                    <p>{node.text}</p>
                </div>
             ))}

             {/* Current Node */}
             <div className="animate-fade-in-up pb-20">
                <div className="flex items-center justify-center mb-8 text-gold opacity-80">
                   <div className="h-[1px] w-12 bg-gold"></div>
                   <i className="fa-solid fa-diamond text-sm mx-4 animate-spin-slow"></i>
                   <span className="uppercase tracking-[0.3em] text-sm font-display">
                       {turnCount === 1 ? "序幕" : "当前场景"}
                   </span>
                   <i className="fa-solid fa-diamond text-sm mx-4 animate-spin-slow"></i>
                   <div className="h-[1px] w-12 bg-gold"></div>
                </div>
                
                <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-12 drop-shadow-md text-justify text-paper first-letter:text-6xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                  {currentStory.text}
                </p>

                {loading ? (
                   <div className="flex flex-col justify-center items-center py-12 gap-4">
                      <div className="relative">
                          <i className="fa-solid fa-sun fa-spin text-6xl text-gold opacity-20"></i>
                          <i className="fa-solid fa-eye absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-gold animate-pulse"></i>
                      </div>
                      <span className="font-serif italic text-xl text-stone-gray animate-pulse">规则引擎正在演算后果...</span>
                      <div className="text-xs text-brown font-mono mt-2">
                          Checking: {rules.filter(r => r.active).map(r => r.title).slice(0, 3).join(", ")}...
                      </div>
                   </div>
                ) : (
                  <div className="grid gap-6 max-w-3xl mx-auto">
                    {currentStory.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice.id, choice.text)}
                        className="group relative p-6 bg-[#2c1810] border-2 border-brown text-left hover:bg-[#3d2216] hover:border-gold transition-all duration-300 rounded-xl overflow-hidden shadow-lg"
                      >
                         <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
                         <div className="absolute left-0 top-0 bottom-0 w-2 bg-gold transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
                         
                         <div className="flex items-start gap-4">
                             <div className="mt-1 text-gold opacity-50 group-hover:opacity-100"><i className="fa-solid fa-chevron-right"></i></div>
                             <div>
                                <h4 className="font-bold text-xl mb-2 group-hover:text-gold transition-colors font-display">{choice.text}</h4>
                                <div className="flex flex-wrap gap-4 text-sm opacity-70 font-serif">
                                    {choice.cost && <span className="text-red-400 flex items-center gap-1"><i className="fa-solid fa-coins"></i> {choice.cost}</span>}
                                    {choice.risk && <span className="text-orange-400 flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation"></i> {choice.risk}</span>}
                                    <span className="text-stone-gray italic border-l border-stone-gray pl-3">{choice.consequence}</span>
                                </div>
                             </div>
                         </div>
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rules Deck (25%) */}
        <div className="hidden md:flex flex-col w-1/4 bg-[#140404] border-l-4 border-brown-600 p-6 shadow-2xl z-10">
            <h2 className="text-gold font-display text-xl mb-6 border-b border-brown pb-2 flex justify-between items-center">
              <span>世界法则</span>
              <span className="text-xs bg-velvet-red px-2 py-1 rounded text-gold border border-gold">{rules.filter(r => r.active).length} 激活</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-4">
               {rules.filter(r => r.active).map(rule => (
                  <RuleCardComponent key={rule.id} rule={rule} />
               ))}
               
               {rules.some(r => !r.active) && (
                   <div className="text-center p-4 border border-dashed border-brown-600 opacity-50 rounded-lg">
                       <p className="text-xs text-stone-gray">隐藏的规则在黑暗中沉睡...</p>
                   </div>
               )}
            </div>

            <div className="mt-6 p-4 bg-brown-800/20 rounded border border-brown text-center">
                <i className="fa-solid fa-gear text-2xl text-brown mb-2 animate-spin-slow opacity-50"></i>
                <p className="text-xs text-stone-gray italic">"系统正在监听每一个抉择。"</p>
            </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {phase === Phase.SELECTION && renderSelection()}
      {phase === Phase.GAMEPLAY && renderGameplay()}
      {phase === Phase.GAME_OVER && renderGameOver()}
    </>
  );
};

export default App;
