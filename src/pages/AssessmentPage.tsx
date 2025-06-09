import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Over the past two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 2,
    text: "How often have you been bothered by not being able to stop or control worrying?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 3,
    text: "Over the past two weeks, how often have you felt little interest or pleasure in doing things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 4,
    text: "How often have you been feeling down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 5,
    text: "How would you rate your overall stress level in the past month?",
    options: ["Very low", "Low", "Moderate", "High", "Very high"]
  },
  {
    id: 6,
    text: "How well have you been sleeping lately?",
    options: ["Very well", "Well", "Fair", "Poor", "Very poor"]
  },
  {
    id: 7,
    text: "How often do you engage in self-care activities?",
    options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never"]
  },
  {
    id: 8,
    text: "How comfortable are you with seeking support when you need it?",
    options: ["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]
  }
];

const AssessmentPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 3; // Assuming 4 options (0-3) per question
    const percentage = (totalScore / maxScore) * 100;

    let resultMessage = '';
    let recommendations = [];

    if (percentage <= 25) {
      resultMessage = "Your responses suggest you're managing well overall. Continue with your current self-care practices.";
      recommendations = [
        "Maintain your current wellness routine",
        "Continue regular exercise and healthy habits",
        "Stay connected with supportive relationships"
      ];
    } else if (percentage <= 50) {
      resultMessage = "Your responses indicate some areas that could benefit from attention. Consider focusing on stress management and self-care.";
      recommendations = [
        "Practice daily mindfulness or meditation",
        "Establish a regular sleep schedule",
        "Consider talking to a counselor or therapist",
        "Engage in regular physical activity"
      ];
    } else if (percentage <= 75) {
      resultMessage = "Your responses suggest you may be experiencing significant stress or mental health challenges. It's important to seek support.";
      recommendations = [
        "Consider professional counseling or therapy",
        "Practice stress reduction techniques",
        "Reach out to trusted friends or family",
        "Consider speaking with your healthcare provider"
      ];
    } else {
      resultMessage = "Your responses indicate you may be experiencing severe mental health challenges. Please consider seeking professional help immediately.";
      recommendations = [
        "Contact a mental health professional",
        "Reach out to a crisis helpline if needed",
        "Don't hesitate to seek emergency care if you're in crisis",
        "Connect with supportive friends and family"
      ];
    }

    setResults(resultMessage);
    setIsComplete(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-blue-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/home" className="flex items-center">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Melvis</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h1>
              <p className="text-gray-600">Thank you for taking the time to complete your mental health assessment.</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Results</h2>
              <p className="text-gray-700 mb-6">{results}</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {/* Add recommendations based on results */}
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Consider speaking with a mental health professional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Practice daily mindfulness and meditation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Maintain regular exercise and healthy sleep habits</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/meditation"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Explore Meditation Resources
              </Link>
              <Link
                to="/home"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Return to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {questions[currentQuestion].text}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[questions[currentQuestion].id] === index
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[questions[currentQuestion].id] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {answers[questions[currentQuestion].id] === index && (
                        <div className="w-full h-full rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={answers[questions[currentQuestion].id] === undefined}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssessmentPage;