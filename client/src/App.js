import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import FieldQuiz from './pages/FieldQuiz';
import PsychometricTest from './pages/PsychometricTest';
import CareerResults from './pages/CareerResults';
import MLRecommendations from './pages/MLRecommendations';
import Colleges from './pages/Colleges';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/quiz" element={<Quiz />} />
              <Route path="/field-quiz" element={<FieldQuiz />} />
              <Route path="/psychometric-test" element={<PsychometricTest />} />
              <Route path="/career-results" element={<CareerResults />} />
              <Route path="/ml-recommendations" element={<MLRecommendations />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;