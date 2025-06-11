import React from 'react';
import { Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] flex items-end space-x-2 ${
          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md'
              : 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md'
          }`}
        >
          {message.sender === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Heart className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 max-w-full ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-800 shadow-md border border-gray-100'
          } ${
            message.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
          
          {/* Timestamp */}
          <div className="flex items-center justify-end mt-2">
            <span 
              className={`text-xs ${
                message.sender === 'user' 
                  ? 'text-blue-100' 
                  : 'text-gray-500'
              }`}
            >
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
