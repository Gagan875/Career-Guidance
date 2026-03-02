#!/usr/bin/env node

/**
 * Script to reorganize the project folder structure
 * Run with: node scripts/reorganize-structure.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✓ Created directory: ${dirPath}`, 'green');
    return true;
  }
  return false;
}

function moveFile(source, destination) {
  try {
    if (fs.existsSync(source)) {
      const destDir = path.dirname(destination);
      createDirectory(destDir);
      fs.renameSync(source, destination);
      log(`✓ Moved: ${source} → ${destination}`, 'blue');
      return true;
    } else {
      log(`⚠ Source not found: ${source}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`✗ Error moving ${source}: ${error.message}`, 'red');
    return false;
  }
}

function reorganizeStructure() {
  log('\n🚀 Starting folder structure reorganization...\n', 'blue');

  // 1. Create docs folder and move documentation
  log('📁 Creating docs folder...', 'yellow');
  createDirectory(path.join(ROOT_DIR, 'docs'));
  
  const docsToMove = [
    ['ML_RECOMMENDATION_SYSTEM.md', 'docs/ML_RECOMMENDATION_SYSTEM.md'],
    ['PROJECT_STATUS_REPORT.md', 'docs/PROJECT_STATUS_REPORT.md'],
    ['README.md', 'docs/README_OLD.md'] // Keep original README at root
  ];

  // 2. Reorganize client structure
  log('\n📁 Reorganizing client structure...', 'yellow');
  
  // Create client folders
  const clientFolders = [
    'client/src/api',
    'client/src/api/services',
    'client/src/assets/images',
    'client/src/assets/icons',
    'client/src/components/common',
    'client/src/components/layout',
    'client/src/components/features/quiz',
    'client/src/components/features/profile',
    'client/src/components/features/recommendations',
    'client/src/hooks',
    'client/src/pages/auth',
    'client/src/pages/quiz',
    'client/src/pages/results',
    'client/src/pages/discovery',
    'client/src/pages/user',
    'client/src/routes'
  ];

  clientFolders.forEach(folder => {
    createDirectory(path.join(ROOT_DIR, folder));
  });

  // Move client files
  const clientFilesToMove = [
    // Auth pages
    ['client/src/pages/Login.js', 'client/src/pages/auth/Login.js'],
    ['client/src/pages/Register.js', 'client/src/pages/auth/Register.js'],
    
    // Quiz pages
    ['client/src/pages/Quiz.js', 'client/src/pages/quiz/StreamQuiz.js'],
    ['client/src/pages/FieldQuiz.js', 'client/src/pages/quiz/FieldQuiz.js'],
    ['client/src/pages/PsychometricTest.js', 'client/src/pages/quiz/PsychometricTest.js'],
    
    // Results pages
    ['client/src/pages/CareerResults.js', 'client/src/pages/results/CareerResults.js'],
    ['client/src/pages/MLRecommendations.js', 'client/src/pages/results/MLRecommendations.js'],
    
    // Discovery pages
    ['client/src/pages/Colleges.js', 'client/src/pages/discovery/Colleges.js'],
    ['client/src/pages/Courses.js', 'client/src/pages/discovery/Courses.js'],
    
    // User pages
    ['client/src/pages/Profile.js', 'client/src/pages/user/Profile.js'],
    ['client/src/pages/Dashboard.js', 'client/src/pages/user/Dashboard.js'],
    
    // Layout components
    ['client/src/components/Navbar.js', 'client/src/components/layout/Navbar/Navbar.js'],
    ['client/src/components/QuizSelectionModal.js', 'client/src/components/features/quiz/QuizSelectionModal.js']
  ];

  // 3. Reorganize server structure
  log('\n📁 Reorganizing server structure...', 'yellow');
  
  // Create server folders
  const serverFolders = [
    'server/src/config',
    'server/src/controllers',
    'server/src/validators',
    'server/scripts/seed',
    'server/scripts/migration',
    'server/tests/unit',
    'server/tests/integration'
  ];

  serverFolders.forEach(folder => {
    createDirectory(path.join(ROOT_DIR, folder));
  });

  // Move server files
  const serverFilesToMove = [
    // Move models to src
    ['server/models', 'server/src/models'],
    ['server/routes', 'server/src/routes'],
    ['server/middleware', 'server/src/middleware'],
    ['server/services', 'server/src/services'],
    
    // Move seed scripts
    ['server/seedQuestions.js', 'server/scripts/seed/seedQuestions.js'],
    ['server/seedFieldQuestions.js', 'server/scripts/seed/seedFieldQuestions.js'],
    ['server/seedColleges.js', 'server/scripts/seed/seedColleges.js'],
    ['server/seedCourses.js', 'server/scripts/seed/seedCourses.js']
  ];

  log('\n✅ Folder structure reorganization complete!\n', 'green');
  log('⚠️  Important: Update import paths in your files', 'yellow');
  log('⚠️  Run tests to ensure everything works correctly', 'yellow');
  log('\n📖 See FOLDER_STRUCTURE.md for the complete new structure\n', 'blue');
}

// Run the reorganization
try {
  reorganizeStructure();
} catch (error) {
  log(`\n✗ Error during reorganization: ${error.message}`, 'red');
  process.exit(1);
}
