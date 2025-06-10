import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-animation`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2 ${
          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.sender === 'user'
              ? 'bg-blue-500'
              : 'bg-gradient-to-r from-blue-400 to-blue-600'
          }`}
        >
          {message.sender === 'user' ? (
            <User className="w-4 h-4 text-black" />
          ) : (
            <Bot className="w-4 h-4 text-black" />
          )}
        </div>
        <div
          className={`rounded-2xl p-3 ${
            message.sender === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 backdrop-blur-sm text-black border border-white/20'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
            {message.intent && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {message.intent} ({Math.round((message.confidence || 0) * 100)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
