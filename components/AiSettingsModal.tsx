import React from 'react';
import { 
  useShowAiSettings, useSetShowAiSettings,
  useProvider, useSetProvider,
  useGeminiKey, useSetGeminiKey,
  useOpenaiConfig, useSetOpenaiConfig
} from '../store';

export const AiSettingsModal: React.FC = () => {
  const isOpen = useShowAiSettings();
  const setShowAiSettings = useSetShowAiSettings();
  const provider = useProvider();
  const setProvider = useSetProvider();
  const geminiKey = useGeminiKey();
  const setGeminiKey = useSetGeminiKey();
  const openaiConfig = useOpenaiConfig();
  const setOpenaiConfig = useSetOpenaiConfig();

  const onClose = () => setShowAiSettings(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a0f0f] border-4 border-double border-gold rounded-lg w-full max-w-md shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden animate-fade-in">
         <div className="p-6 border-b border-gold/30 flex items-center justify-between bg-velvet-red/20">
           <h3 className="font-display text-2xl text-gold flex items-center gap-2 uppercase tracking-widest">
             <i className="fa-solid fa-cog"></i>
             AI 设置
           </h3>
           <button 
             onClick={onClose} 
             className="text-gold/60 hover:text-gold p-2 rounded-full hover:bg-gold/10 transition-colors"
           >
             <i className="fa-solid fa-times text-xl"></i>
           </button>
         </div>
         
         <div className="p-6 space-y-6 bg-[#0f0303]">
            
            {/* Provider Selector */}
            <div className="space-y-3">
               <label className="flex items-center gap-3 p-4 border-2 border-brown-600 rounded-lg cursor-pointer hover:border-gold transition-colors bg-brown-800/30">
                  <input 
                    type="radio" 
                    name="provider" 
                    checked={provider === 'gemini'} 
                    onChange={() => setProvider('gemini')}
                    className="w-4 h-4 text-gold focus:ring-gold accent-gold"
                  />
                  <div className="flex-1">
                    <span className="block text-base font-display text-paper">Google Gemini</span>
                    <span className="block text-xs text-stone-gray">默认推荐</span>
                  </div>
               </label>
               
               <label className="flex items-center gap-3 p-4 border-2 border-brown-600 rounded-lg cursor-pointer hover:border-gold transition-colors bg-brown-800/30">
                  <input 
                    type="radio" 
                    name="provider" 
                    checked={provider === 'openai'} 
                    onChange={() => setProvider('openai')}
                    className="w-4 h-4 text-gold focus:ring-gold accent-gold"
                  />
                  <div className="flex-1">
                    <span className="block text-base font-display text-paper">OpenAI</span>
                    <span className="block text-xs text-stone-gray">需要 API Key</span>
                  </div>
               </label>
            </div>

            {/* Gemini Config Fields */}
            {provider === 'gemini' && (
               <div className="space-y-4 pt-4 border-t border-brown-600 animate-fade-in">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gold uppercase tracking-wider">API Key (可选)</label>
                   <input 
                     type="password" 
                     value={geminiKey}
                     onChange={(e) => setGeminiKey(e.target.value)}
                     placeholder="留空使用系统默认 Key..."
                     className="w-full px-4 py-3 text-sm bg-brown-800/50 border-2 border-brown-600 text-paper rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all placeholder-stone-gray/50"
                   />
                   <p className="text-[10px] text-stone-gray italic">如果您有自己的 Google Gemini API Key，请在此输入。否则将使用系统默认密钥。</p>
                 </div>
               </div>
            )}

            {/* OpenAI Config Fields */}
            {provider === 'openai' && (
              <div className="space-y-4 pt-4 border-t border-brown-600 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-wider">Base URL</label>
                  <input 
                    type="text" 
                    value={openaiConfig.baseUrl}
                    onChange={(e) => setOpenaiConfig(prev => ({...prev, baseUrl: e.target.value}))}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-4 py-3 text-sm bg-brown-800/50 border-2 border-brown-600 text-paper rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-wider">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    value={openaiConfig.apiKey}
                    onChange={(e) => setOpenaiConfig(prev => ({...prev, apiKey: e.target.value}))}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 text-sm bg-brown-800/50 border-2 border-brown-600 text-paper rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gold uppercase tracking-wider">模型名称</label>
                  <input 
                    type="text" 
                    value={openaiConfig.model}
                    onChange={(e) => setOpenaiConfig(prev => ({...prev, model: e.target.value}))}
                    placeholder="gpt-4-turbo-preview"
                    className="w-full px-4 py-3 text-sm bg-brown-800/50 border-2 border-brown-600 text-paper rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>
            )}
         </div>

         <div className="p-4 bg-velvet-red/20 border-t border-gold/30 flex justify-end">
           <button 
              onClick={onClose}
              className="px-8 py-3 bg-gold hover:bg-white text-black font-bold font-display uppercase tracking-widest transition-colors rounded shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
           >
             保存设置
           </button>
         </div>
      </div>
    </div>
  );
};
