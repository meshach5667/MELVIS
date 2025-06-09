import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}

const Suggestions: React.FC<SuggestionsProps> = ({ 
  suggestions, 
  onSuggestionClick, 
  isLoading 
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="p-4 border-t border-white/20">
      <div className="flex items-center space-x-2 mb-2">
        <Lightbulb className="w-4 h-4 text-blue-300" />
        <span className="text-blue-200 text-sm font-medium">Suggestions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full border border-white/20 transition-colors duration-200 hover:scale-105 transform button-press focus-ring"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
