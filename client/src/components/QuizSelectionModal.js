import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/animations.css';

const QuizSelectionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStreamQuiz = () => {
    onClose();
    navigate('/quiz');
  };

  const handleFieldQuiz = () => {
    onClose();
    navigate('/field-quiz');
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all animate-scaleIn border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Choose Your Quiz Type
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg mb-8">
            Select the quiz that matches your current academic level
          </p>

          {/* Stream Selection Quiz - After Class 10 */}
          <button
            onClick={handleStreamQuiz}
            className="w-full p-6 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900 dark:hover:to-indigo-900 transition-all duration-300 group hover:shadow-lg transform hover:scale-[1.02]"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800 dark:group-hover:to-indigo-800 transition-all duration-300 shadow-md">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Stream Selection Quiz
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  For students after Class 10th
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Choose between Science, Commerce, Arts, or Diploma streams
                </p>
              </div>
            </div>
          </button>

          {/* Field Selection Quiz - After Class 12 */}
          <button
            onClick={handleFieldQuiz}
            className="w-full p-6 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900 dark:hover:to-emerald-900 transition-all duration-300 group hover:shadow-lg transform hover:scale-[1.02]"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 dark:group-hover:from-green-800 dark:group-hover:to-emerald-800 transition-all duration-300 shadow-md">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  Field Selection Quiz
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  For students after Class 12th
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Discover specific career fields and specializations
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-800 rounded-b-2xl border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            Both quizzes provide personalized career recommendations based on your interests and aptitude
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default QuizSelectionModal;