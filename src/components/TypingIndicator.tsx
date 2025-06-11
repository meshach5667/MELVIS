import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex justify-start"
  >
    <div className="flex items-end space-x-2">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md flex items-center justify-center flex-shrink-0">
        <Heart className="w-4 h-4 text-white" />
      </div>
      
      {/* Typing bubble */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center space-x-2">
        <div className="flex space-x-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span className="text-gray-500 text-sm ml-2">Melvis is thinking...</span>
      </div>
    </div>
  </motion.div>
);

export default TypingIndicator;
