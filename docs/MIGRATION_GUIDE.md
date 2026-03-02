# Migration Guide: Improved Folder Structure

## Overview
This guide helps you migrate from the current folder structure to the improved, more scalable structure.

## Before You Start

### Backup Your Code
```bash
git checkout -b backup-before-restructure
git push origin backup-before-restructure
```

### Create a New Branch
```bash
git checkout -b feature/improved-folder-structure
```

## Step-by-Step Migration

### Phase 1: Documentation (Low Risk)

1. **Create docs folder**
   ```bash
   mkdir docs
   ```

2. **Move documentation files**
   ```bash
   mv ML_RECOMMENDATION_SYSTEM.md docs/
   mv PROJECT_STATUS_REPORT.md docs/
   cp README.md docs/README_OLD.md
   ```

### Phase 2: Client Reorganization

#### 2.1 Create New Folders
```bash
# API layer
mkdir -p client/src/api/services

# Assets
mkdir -p client/src/assets/{images,icons,fonts}

# Components
mkdir -p client/src/components/{common,layout,features}
mkdir -p client/src/components/features/{quiz,profile,recommendations}

# Hooks
mkdir -p client/src/hooks

# Pages
mkdir -p client/src/pages/{auth,quiz,results,discovery,user}

# Routes
mkdir -p client/src/routes
```

#### 2.2 Move and Rename Files

**Auth Pages:**
```bash
mv client/src/pages/Login.js client/src/pages/auth/
mv client/src/pages/Register.js client/src/pages/auth/
```

**Quiz Pages:**
```bash
mv client/src/pages/Quiz.js client/src/pages/quiz/StreamQuiz.js
mv client/src/pages/FieldQuiz.js client/src/pages/quiz/
mv client/src/pages/PsychometricTest.js client/src/pages/quiz/
```

**Results Pages:**
```bash
mv client/src/pages/CareerResults.js client/src/pages/results/
mv client/src/pages/MLRecommendations.js client/src/pages/results/
```

**Discovery Pages:**
```bash
mv client/src/pages/Colleges.js client/src/pages/discovery/
mv client/src/pages/Courses.js client/src/pages/discovery/
```

**User Pages:**
```bash
mv client/src/pages/Profile.js client/src/pages/user/
mv client/src/pages/Dashboard.js client/src/pages/user/
```

**Components:**
```bash
# Create component folders
mkdir -p client/src/components/layout/Navbar
mkdir -p client/src/components/features/quiz

# Move components
mv client/src/components/Navbar.js client/src/components/layout/Navbar/Navbar.js
mv client/src/components/QuizSelectionModal.js client/src/components/features/quiz/
```

#### 2.3 Update Import Paths in Client

Create a script to update imports:

```javascript
// client/src/config/paths.js
export const PATHS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Quiz
  STREAM_QUIZ: '/quiz/stream',
  FIELD_QUIZ: '/quiz/field',
  PSYCHOMETRIC: '/quiz/psychometric',
  
  // Results
  CAREER_RESULTS: '/results/career',
  ML_RECOMMENDATIONS: '/results/ml',
  
  // Discovery
  COLLEGES: '/discovery/colleges',
  COURSES: '/discovery/courses',
  
  // User
  PROFILE: '/user/profile',
  DASHBOARD: '/user/dashboard',
  
  // Home
  HOME: '/'
};
```

Update `App.js`:
```javascript
// Old imports
import Login from './pages/Login';
import Quiz from './pages/Quiz';

// New imports
import Login from './pages/auth/Login';
import StreamQuiz from './pages/quiz/StreamQuiz';
```

### Phase 3: Server Reorganization

#### 3.1 Create New Folders
```bash
# Core folders
mkdir -p server/src/{config,controllers,validators}

# Scripts
mkdir -p server/scripts/{seed,migration}

# Tests
mkdir -p server/tests/{unit,integration,e2e}
```

#### 3.2 Move Server Files

**Move to src:**
```bash
# If not already in src
mv server/models server/src/
mv server/routes server/src/
mv server/middleware server/src/
mv server/services server/src/
```

**Move seed scripts:**
```bash
mv server/seedQuestions.js server/scripts/seed/
mv server/seedFieldQuestions.js server/scripts/seed/
mv server/seedColleges.js server/scripts/seed/
mv server/seedCourses.js server/scripts/seed/
mv server/addMoreFieldQuestions.js server/scripts/seed/
mv server/addQualityQuestions.js server/scripts/seed/
```

**Move utility scripts:**
```bash
mv server/checkQuestions.js server/scripts/
mv server/testFieldQuestions.js server/scripts/
mv server/debugFieldQuiz.js server/scripts/
```

#### 3.3 Create Controllers

Extract route handlers into controllers:

```javascript
// server/src/controllers/quiz.controller.js
const QuizService = require('../services/quiz.service');

class QuizController {
  async getRandomQuestions(req, res, next) {
    try {
      const questions = await QuizService.getRandomQuestions(req.query);
      res.json({ questions });
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(req, res, next) {
    try {
      const result = await QuizService.submitQuiz(req.body, req.user);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();
```

#### 3.4 Update Server Entry Point

```javascript
// server/index.js
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

```javascript
// server/src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;
```

### Phase 4: Create API Services (Client)

```javascript
// client/src/api/axios.config.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

```javascript
// client/src/api/services/quiz.service.js
import apiClient from '../axios.config';

export const quizService = {
  getStreamQuestions: (params) => 
    apiClient.get('/stream-quiz/random', { params }),
  
  getFieldQuestions: (params) => 
    apiClient.get('/field-quiz/random', { params }),
  
  submitStreamQuiz: (data) => 
    apiClient.post('/stream-quiz/submit', data),
  
  submitFieldQuiz: (data) => 
    apiClient.post('/field-quiz/submit', data),
  
  getQuizHistory: () => 
    apiClient.get('/quiz/history'),
};
```

### Phase 5: Create Custom Hooks

```javascript
// client/src/hooks/useTimer.js
import { useState, useEffect } from 'react';

export const useTimer = (initialTime, onTimeUp) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, timeRemaining, onTimeUp]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setTimeRemaining(initialTime);
    setIsActive(false);
  };

  return { timeRemaining, isActive, start, pause, reset };
};
```

```javascript
// client/src/hooks/useQuiz.js
import { useState, useCallback } from 'react';
import { quizService } from '../api/services/quiz.service';

export const useQuiz = (quizType) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const service = quizType === 'stream' 
        ? quizService.getStreamQuestions 
        : quizService.getFieldQuestions;
      
      const response = await service(params);
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [quizType]);

  const submitAnswer = useCallback((answer) => {
    setAnswers((prev) => [...prev, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, questions.length]);

  return {
    questions,
    currentQuestion,
    answers,
    loading,
    error,
    fetchQuestions,
    submitAnswer,
  };
};
```

## Testing After Migration

### 1. Test Client
```bash
cd client
npm start
```

Verify:
- All pages load correctly
- Navigation works
- API calls succeed
- No console errors

### 2. Test Server
```bash
cd server
npm start
```

Verify:
- Server starts without errors
- All routes work
- Database connections succeed

### 3. Run Tests
```bash
# Client tests
cd client
npm test

# Server tests
cd server
npm test
```

## Rollback Plan

If issues occur:
```bash
git checkout backup-before-restructure
```

## Commit Strategy

Make small, incremental commits:

```bash
git add docs/
git commit -m "docs: reorganize documentation"

git add client/src/pages/auth/
git commit -m "refactor(client): move auth pages"

git add client/src/pages/quiz/
git commit -m "refactor(client): reorganize quiz pages"

# Continue for each logical group
```

## Benefits After Migration

✅ **Better Organization**: Clear separation of concerns
✅ **Easier Navigation**: Intuitive folder structure
✅ **Improved Scalability**: Easy to add new features
✅ **Better Testing**: Organized test structure
✅ **Team Collaboration**: Easier for team members to find code
✅ **Maintainability**: Cleaner codebase

## Next Steps

1. Update README.md with new structure
2. Update CI/CD pipelines if needed
3. Update deployment scripts
4. Document new conventions for the team
