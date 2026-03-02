// Utility functions for quiz management

// Clear all stored question history (for testing)
export const clearQuestionHistory = () => {
  localStorage.removeItem('usedQuestions');
  console.log('Cleared all question history from localStorage');
};

// Get current question history count
export const getQuestionHistoryCount = () => {
  const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
  return usedQuestions.length;
};

// Get quiz count (approximate)
export const getQuizCount = () => {
  const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
  return Math.floor(usedQuestions.length / 20);
};

// Add these functions to window for easy testing in console
if (typeof window !== 'undefined') {
  window.clearQuestionHistory = clearQuestionHistory;
  window.getQuestionHistoryCount = getQuestionHistoryCount;
  window.getQuizCount = getQuizCount;
}