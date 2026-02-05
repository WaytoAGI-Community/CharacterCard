import React, { useState, useEffect } from 'react';
import { Phase, GameState, Character, StoryNode, RuleCard } from './types';
import { CHARACTERS, INITIAL_RULES, INTRO_STORY } from './constants';
import CharacterCard from './components/CharacterCard';
import RuleCardComponent from './components/RuleCard';
import { generateNextChapter } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: Phase.SELECTION,
    character: null,
    rules: INITIAL_RULES,
    storyLog: [],
    currentStory: null,
    realityStats: { credibility: 5, stress: 2, connections: 3 }
  });

  const [loading, setLoading] = useState(false);

  // Initialize Audio (simulated music loop)
  useEffect(() => {
    // In a real app, load atmospheric audio here
  }, []);

  const handleCharacterSelect = (char: Character) => {
    setGameState(prev => ({ ...prev, character: char }));
  };

  const startGame = () => {
    if (!gameState.character) return;
    
    setGameState(prev => ({
      ...prev,
      phase: Phase.GAMEPLAY,
      currentStory: INTRO_STORY,
      storyLog: [INTRO_STORY]
    }));
  };

  const handleChoice = async (choiceId: string, choiceText: string) => {
    if (!gameState.character) return;
    
    setLoading(true);
    
    // 1. Update Stats based on choice (Simplified Logic)
    // In a full implementation, the LLM would parse the 'cost/risk' and update these.
    const newStats = { ...gameState.realityStats };
    if (choiceText.toLowerCase().includes("aggressive") || choiceText.toLowerCase().includes("fight")) newStats.stress += 2;
    if (choiceText.toLowerCase().includes("wait") || choiceText.toLowerCase().includes("rest")) newStats.stress = Math.max(0, newStats.stress - 1);
    
    // 2. Mock Rule Dynamic Change
    const newRules = [...gameState.rules];
    if (newStats.stress > 6 && !newRules.find(r => r.id === 'panic')) {
      newRules.push({
        id: 'panic',
        title: '恐慌发作',
        type: 'RISK',
        description: '你呼吸急促。智力检定处于劣势。',
        active: true
      });
    }

    // 3. Generate Next Story Node
    const historySummary = gameState.storyLog.map(n => n.text).join(' ').slice(-800);
    const nextNode = await generateNextChapter(
      gameState.character,
      newRules,
      choiceText,
      historySummary
    );

    setGameState(prev => ({
      ...prev,
      rules: newRules,
      realityStats: newStats,
      currentStory: nextNode,
      storyLog: [...prev.storyLog, nextNode]
    }));

    setLoading(false);
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

        {/* Start Button Area (Top for visibility) */}
        <div className="z-20 flex flex-col items-center gap-4 mb-12 sticky top-4">
            <button 
              disabled={!gameState.character}
              onClick={startGame}
              className={`
                px-12 py-4 text-xl font-bold font-display tracking-widest uppercase transition-all duration-500
                border-2 border-gold relative overflow-hidden group shadow-2xl
                ${gameState.character 
                  ? 'bg-velvet-red text-gold shadow-[0_0_30px_#D4AF37] hover:scale-110' 
                  : 'bg-gray-900 text-gray-600 cursor-not-allowed border-gray-700'}
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                 {gameState.character ? `化身 ${gameState.character.name}` : '选择角色'}
                 <i className="fa-solid fa-scroll"></i>
              </span>
              <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            </button>
        </div>

        {/* Gallery Grid */}
        <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1600px] mb-20 px-4">
          {CHARACTERS.map(char => (
            <div key={char.id} className="flex justify-center">
               <CharacterCard 
                  character={char} 
                  isSelected={gameState.character?.id === char.id}
                  onSelect={handleCharacterSelect}
               />
            </div>
          ))}
        </div>
    </div>
  );

  const renderGameplay = () => {
    if (!gameState.currentStory) return null;

    return (
      <div className="min-h-screen w-full bg-[#1a0505] flex flex-col md:flex-row text-paper overflow-hidden">
        
        {/* LEFT COLUMN: Character & Stats (25%) */}
        <div className="hidden md:flex flex-col w-1/4 bg-[#0f0303] border-r-4 border-brown-600 p-6 relative shadow-2xl z-10">
          <div className="sticky top-6">
            <h2 className="text-gold font-display text-2xl mb-6 border-b border-brown pb-2 text-center">当前角色</h2>
            {gameState.character && (
               <div className="flex justify-center transform scale-75 origin-top mb-[-80px]">
                 {/* Reusing the card component for display but non-interactive */}
                 <CharacterCard character={gameState.character} isSelected={true} />
               </div>
            )}
            
            <div className="mt-28">
                <h2 className="text-gold font-display text-xl mb-4 border-b border-brown pb-2">现实映射</h2>
                <div className="space-y-6 bg-brown-800/30 p-4 rounded-lg border border-brown">
                <div className="group">
                    <div className="flex justify-between mb-1 text-sm font-bold text-stone-gray">
                        <span><i className="fa-solid fa-scale-balanced mr-2"></i>信誉度</span> 
                        <span>{gameState.realityStats.credibility}/10</span>
                    </div>
                    <div className="w-full bg-[#2c1810] h-3 rounded-full overflow-hidden border border-brown-600">
                        <div className="bg-forest-green h-full transition-all duration-1000" style={{ width: `${gameState.realityStats.credibility * 10}%` }}></div>
                    </div>
                </div>
                <div className="group">
                    <div className="flex justify-between mb-1 text-sm font-bold text-stone-gray">
                        <span><i className="fa-solid fa-heart-crack mr-2"></i>精神压力</span> 
                        <span>{gameState.realityStats.stress}/10</span>
                    </div>
                    <div className="w-full bg-[#2c1810] h-3 rounded-full overflow-hidden border border-brown-600">
                        <div className="bg-red-700 h-full transition-all duration-1000" style={{ width: `${gameState.realityStats.stress * 10}%` }}></div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Narrative (50%) */}
        <div className="flex-1 flex flex-col relative h-screen bg-paper/5">
          <div className="flex-1 overflow-y-auto p-8 md:p-16 scrollbar-hide">
             {/* Story Log */}
             {gameState.storyLog.slice(0, -1).map((node, idx) => (
                <div key={idx} className="mb-12 opacity-50 text-base font-serif border-l-4 border-brown-600 pl-6 italic hover:opacity-100 transition-opacity">
                    <p>{node.text}</p>
                </div>
             ))}

             {/* Current Node */}
             <div className="animate-fade-in-up pb-20">
                <div className="flex items-center justify-center mb-8 text-gold opacity-80">
                   <div className="h-[1px] w-12 bg-gold"></div>
                   <i className="fa-solid fa-diamond text-sm mx-4 animate-spin-slow"></i>
                   <span className="uppercase tracking-[0.3em] text-sm font-display">当前场景</span>
                   <i className="fa-solid fa-diamond text-sm mx-4 animate-spin-slow"></i>
                   <div className="h-[1px] w-12 bg-gold"></div>
                </div>
                
                <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-12 drop-shadow-md text-justify text-paper first-letter:text-6xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                  {gameState.currentStory.text}
                </p>

                {loading ? (
                   <div className="flex flex-col justify-center items-center py-12 gap-4">
                      <div className="relative">
                          <i className="fa-solid fa-sun fa-spin text-6xl text-gold opacity-20"></i>
                          <i className="fa-solid fa-eye absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-gold animate-pulse"></i>
                      </div>
                      <span className="font-serif italic text-xl text-stone-gray animate-pulse">先知正在编织命运...</span>
                   </div>
                ) : (
                  <div className="grid gap-6 max-w-3xl mx-auto">
                    {gameState.currentStory.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice.id, choice.text)}
                        className="group relative p-6 bg-[#2c1810] border-2 border-brown text-left hover:bg-[#3d2216] hover:border-gold transition-all duration-300 rounded-xl overflow-hidden shadow-lg"
                      >
                         {/* Hover Effect */}
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
              <span className="text-xs bg-velvet-red px-2 py-1 rounded text-gold border border-gold">{gameState.rules.filter(r => r.active).length} 激活</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-4">
               {gameState.rules.filter(r => r.active).map(rule => (
                  <RuleCardComponent key={rule.id} rule={rule} />
               ))}
               
               {/* Inactive/Hidden Rules Hint */}
               {gameState.rules.some(r => !r.active) && (
                   <div className="text-center p-4 border border-dashed border-brown-600 opacity-50 rounded-lg">
                       <p className="text-xs text-stone-gray">隐藏的规则在黑暗中沉睡...</p>
                   </div>
               )}
            </div>

            {/* System Status */}
            <div className="mt-6 p-4 bg-brown-800/20 rounded border border-brown text-center">
                <i className="fa-solid fa-eye text-2xl text-brown mb-2 animate-pulse"></i>
                <p className="text-xs text-stone-gray italic">"导演正在注视着你。"</p>
            </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {gameState.phase === Phase.SELECTION && renderSelection()}
      {gameState.phase === Phase.GAMEPLAY && renderGameplay()}
    </>
  );
};

export default App;