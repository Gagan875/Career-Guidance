import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choose Your Quiz Type
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Select the quiz that matches your current academic level
          </p>

          {/* Stream Selection Quiz - After Class 10 */}
          <button
            onClick={handleStreamQuiz}
            className="w-full p-4 border-2 border-primary-200 dark:border-primary-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 transition-all group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Stream Selection Quiz
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For students after Class 10th
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Choose between Science, Commerce, Arts, or Diploma streams
                </p>
              </div>
            </div>
          </button>

          {/* Field Selection Quiz - After Class 12 */}
          <button
            onClick={handleFieldQuiz}
            className="w-full p-4 border-2 border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900 transition-all group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800 transition-colors">
                <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-secondary-600 dark:group-hover:text-secondary-400">
                  Field Selection Quiz
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  For students after Class 12th
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Discover specific career fields and specializations
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Both quizzes provide personalized career recommendations based on your interests and aptitude
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizSelectionModal;