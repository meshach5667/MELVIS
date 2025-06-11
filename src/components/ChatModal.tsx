import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { chatApi, generateUserId } from '../utils/api';
import type { Message } from '../utils/api';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Melvis, your mental health companion. I'm here to listen, support, and help you on your wellness journey. How are you feeling today? 💙",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userId] = useState(() => generateUserId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage({
        message: text.trim(),
        user_id: userId
      });
      
      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting right now. Please try again in a moment. 🌟",
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }, 800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[85vh] md:h-[80vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4 md:p-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Melvis</h2>
                <p className="text-sm text-gray-600">Your wellness companion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-blue-50/30 via-white to-indigo-50/20 smooth-scrollbar">
            <div className="space-y-4 md:space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 md:p-6 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="w-full px-4 md:px-6 py-3 md:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all text-sm md:text-base placeholder-gray-500"
                  disabled={isLoading}
                  maxLength={500}
                />
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all flex items-center justify-center min-w-[3rem] shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </form>
            
            {/* Character count */}
            <div className="mt-2 text-xs text-gray-400 text-right">
              {inputText.length}/500
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatModal;