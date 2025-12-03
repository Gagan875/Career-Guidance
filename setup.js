#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Career Guidance Platform for Team Development...\n');
console.log('📢 Using shared team database - no MongoDB installation required!\n');

// Check if .env exists
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying shared team configuration...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Team environment configured');
    console.log('🔗 Connected to shared team database\n');
  } else {
    console.log('❌ .env.example not found. Please contact your team lead\n');
    process.exit(1);
  }
} else {
  console.log('✅ Environment file already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm run install-all', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  console.log('Please run: npm run install-all\n');
  process.exit(1);
}

// Check MongoDB connection
console.log('🔍 Testing connection to shared team database...');
try {
  const mongoose = require('./server/node_modules/mongoose');
  require('dotenv').config({ path: envPath });
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ Database configuration missing');
    console.log('Please contact your team lead for the latest .env.example file\n');
    process.exit(1);
  }
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to shared team database successfully!');
      console.log('📊 Database:', mongoose.connection.name);
      
      // Check if data already exists (since it's shared)
      return mongoose.connection.db.collection('questions').countDocuments();
    })
    .then(questionCount => {
      if (questionCount > 0) {
        console.log(`✅ Database already contains ${questionCount} quiz questions`);
        console.log('🎯 Ready to go - no seeding needed!\n');
      } else {
        console.log('🌱 Database is empty, seeding with initial data...');
        try {
          execSync('npm run seed-questions', { 
            cwd: path.join(__dirname, 'server'),
            stdio: 'inherit' 
          });
          console.log('✅ Database seeded successfully\n');
        } catch (error) {
          console.log('⚠️  Seeding failed, but you can still use the app');
          console.log('   Another team member may have already seeded the database\n');
        }
      }
      
      console.log('🎉 Team setup complete!\n');
      console.log('🚀 Start developing with: npm run dev');
      console.log('🌐 Your app will run on: http://localhost:3000');
      console.log('📡 API server will run on: http://localhost:5000\n');
      console.log('💡 Tip: All team members share the same database');
      console.log('   Your test data will be visible to other developers\n');
      
      mongoose.disconnect();
    })
    .catch(err => {
      console.log('❌ Failed to connect to shared team database');
      console.log('Error:', err.message);
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Contact your team lead - database might be temporarily unavailable');
      console.log('3. Make sure you have the latest code: git pull\n');
      console.log('📖 For more help, see: TEAM_SETUP.md');
      process.exit(1);
    });
} catch (error) {
  console.log('⚠️  Could not test database connection (dependencies issue)');
  console.log('📖 See TEAM_SETUP.md for manual setup instructions');
  console.log('Then run: npm run dev\n');
}