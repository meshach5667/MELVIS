import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl max-w-xs">
    <Bot className="w-5 h-5 text-blue-300" />
    <div className="typing-indicator">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
    <span className="text-blue-200 text-sm">Melvis is typing...</span>
  </div>
);

export default TypingIndicator;
