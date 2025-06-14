import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Play, Clock, Star, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
  difficulty: string;
  youtubeUrl: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: '10-Minute Morning Meditation',
    description: 'Start your day with calm and focus through this gentle morning meditation practice.',
    duration: '10:24',
    category: 'Morning',
    difficulty: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM'
  },
  {
    id: '2',
    title: 'Anxiety Relief Breathing Exercise',
    description: 'Calm your mind with this powerful breathing technique designed to reduce anxiety.',
    duration: '8:15',
    category: 'Anxiety',
    difficulty: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/YRPh_GaiL8s/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=YRPh_GaiL8s'
  },
  {
    id: '3',
    title: 'Body Scan for Deep Relaxation',
    description: 'Release tension and stress through this comprehensive body scan meditation.',
    duration: '20:30',
    category: 'Relaxation',
    difficulty: 'Intermediate',
    thumbnail: 'https://img.youtube.com/vi/15q-N-_kkrU/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=15q-N-_kkrU'
  },
  {
    id: '4',
    title: 'Sleep Meditation for Insomnia',
    description: 'Drift off to peaceful sleep with this calming bedtime meditation practice.',
    duration: '45:12',
    category: 'Sleep',
    difficulty: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/aAVPDYhW_nA/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=aAVPDYhW_nA'
  },
  {
    id: '5',
    title: 'Mindfulness for Stress Relief',
    description: 'Learn to observe your thoughts without judgment and reduce daily stress.',
    duration: '15:45',
    category: 'Stress',
    difficulty: 'Intermediate',
    thumbnail: 'https://img.youtube.com/vi/ZToicYcHIOU/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZToicYcHIOU'
  },
  {
    id: '6',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others with this heart-opening practice.',
    duration: '12:20',
    category: 'Self-Care',
    difficulty: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/sz7cpV7ERsM/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=sz7cpV7ERsM'
  }
];

const categories = ['All', 'Morning', 'Anxiety', 'Relaxation', 'Sleep', 'Stress', 'Self-Care'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const MeditationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const filteredVideos = mockVideos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || video.difficulty === selectedDifficulty;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleVideoClick = (youtubeUrl: string) => {
    window.open(youtubeUrl, '_blank');
  };

   const getUserDisplayName = () => {
    if (!user) return '';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
      return user.first_name;
    }
    return user.username || 'User';
  };


  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/home" className="flex items-center">
              <ArrowLeft className="h-5 w-5 text-blue-600 mr-2" />
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Melvis</span>
            </Link>
            <div className="text-sm text-gray-600">
              Welcome, {getUserDisplayName()}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meditation & Mindfulness
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover guided meditations, breathing exercises, and mindfulness practices 
            to support your mental wellness journey.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meditations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gray-500" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVideoClick(video.youtubeUrl)}
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {video.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {video.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No meditations found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchTerm('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Meditation Tips for Beginners
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Start Small</h3>
                  <p className="text-gray-600 text-sm">Begin with just 5-10 minutes daily and gradually increase the duration.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Find a Quiet Space</h3>
                  <p className="text-gray-600 text-sm">Choose a comfortable, quiet location where you won't be disturbed.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Be Consistent</h3>
                  <p className="text-gray-600 text-sm">Try to meditate at the same time each day to build a routine.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Be Patient</h3>
                  <p className="text-gray-600 text-sm">Don't worry if your mind wanders - it's normal and part of the practice.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MeditationPage;
