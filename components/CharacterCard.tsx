import React from 'react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  onSelect?: (char: Character) => void;
  isSelected?: boolean;
}

// Simple helper for Roman Numerals to give it that Tarot feel
const toRoman = (num: number) => {
  const map: Record<number, string> = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII'
  };
  return map[num] || 'X';
};

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onSelect, isSelected }) => {
  const cardIdNum = parseInt(character.id.replace('c', ''));

  return (
    <div 
      onClick={() => onSelect && onSelect(character)}
      className={`
        relative w-72 h-[450px] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 transform group
        ${isSelected ? 'scale-105 ring-4 ring-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)] z-20' : 'hover:scale-105 hover:shadow-2xl hover:z-10'}
        border-[6px] border-[#D4AF37] bg-[#1a0f0f]
      `}
    >
        {/* 1. Tarot Header - Roman Numeral */}
        <div className="absolute top-0 w-full h-12 flex justify-center items-center z-20 pointer-events-none">
            <div className="bg-[#D4AF37] text-[#1a0f0f] px-4 pt-1 pb-2 rounded-b-lg font-display font-bold text-sm tracking-widest shadow-md">
                {toRoman(cardIdNum)}
            </div>
        </div>

        {/* 2. Main Character Visual Layer (Full Card) */}
        <div className="absolute inset-0 bg-gray-900">
            {/* Base Image with Tarot styling */}
            <img 
                src={character.imageUrl} 
                alt={character.name} 
                className={`
                    w-full h-full object-cover transition-transform duration-1000
                    ${isSelected ? 'scale-110 grayscale-0' : 'grayscale-[0.5] sepia-[0.3] group-hover:grayscale-0 group-hover:scale-110'}
                `}
            />
            
            {/* Texture Overlays */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505] via-transparent to-[#1a0505] opacity-90 pointer-events-none"></div>
        </div>

        {/* 3. Corner Ornaments */}
        <div className="absolute top-2 left-2 text-[#D4AF37] z-20 opacity-80">
            <i className="fa-solid fa-star-of-life text-xs"></i>
        </div>
        <div className="absolute top-2 right-2 text-[#D4AF37] z-20 opacity-80">
            <i className="fa-solid fa-star-of-life text-xs"></i>
        </div>

        {/* 4. Bottom Name Plate */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] flex flex-col items-center justify-center z-20">
            <div className="border-t border-b border-[#D4AF37] py-2 w-full text-center backdrop-blur-sm bg-black/40">
                <h3 className="text-xl font-bold font-display text-[#f0e6d2] uppercase tracking-wider">{character.name}</h3>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] mt-1">{character.title}</p>
            </div>
        </div>
        
        {/* 5. Hover Overlay for Stats (Slide up effect) */}
        <div className="absolute inset-0 bg-[#1a0505]/95 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30 flex flex-col items-center justify-center text-paper p-6 text-center border-t-2 border-[#D4AF37]">
            <i className="fa-solid fa-eye text-[#D4AF37] mb-2 text-xl"></i>
            <p className="italic font-serif text-sm mb-6 leading-relaxed opacity-90">"{character.description}"</p>
            
            <div className="grid grid-cols-3 gap-2 w-full border-t border-[#D4AF37]/30 pt-4">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">力</span>
                    <span className="text-lg font-display">{character.stats.strength}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">智</span>
                    <span className="text-lg font-display">{character.stats.wits}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">魅</span>
                    <span className="text-lg font-display">{character.stats.charm}</span>
                </div>
            </div>

            <div className="mt-6 w-full text-left">
                <span className="text-[10px] text-red-500 uppercase tracking-widest block mb-1">致命弱点</span>
                <span className="text-xs text-stone-gray block font-serif italic">{character.weakness}</span>
            </div>
        </div>
    </div>
  );
};

export default CharacterCard;