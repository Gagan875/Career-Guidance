#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MongoDB Connection Debug Tool\n');

// Check environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

// Parse and display connection details (hide password)
const uri = process.env.MONGODB_URI;
const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log('🔗 Connection URI:', maskedUri);

// Extract components
try {
  const url = new URL(uri.replace('mongodb+srv://', 'https://'));
  console.log('👤 Username:', url.username || 'Not specified');
  console.log('🔑 Password:', url.password ? '***' : 'Not specified');
  console.log('🏠 Host:', url.hostname);
  console.log('📊 Database:', url.pathname.split('/')[1] || 'Not specified in URI');
} catch (error) {
  console.log('⚠️  Could not parse URI components');
}

console.log('\n🔄 Testing connection...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connection successful!');
    console.log('📊 Connected to database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test basic operations
    console.log('\n🏓 Testing database operations...');
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('✅ Database ping successful');
    
    // List collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('📚 Collections found:', collections.length);
    if (collections.length > 0) {
      collections.forEach(col => console.log(`   - ${col.name}`));
    } else {
      console.log('   (No collections yet - this is normal for a new database)');
    }
    
    console.log('\n🎉 All tests passed! Your database is ready.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n🔐 Authentication Error Solutions:');
      console.error('1. Check username/password in MongoDB Atlas Dashboard');
      console.error('2. Go to Database Access → Users');
      console.error('3. Verify user exists and has correct permissions');
      console.error('4. Reset password if needed');
      console.error('5. Update MONGODB_URI in .env file');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n🌐 Network Error Solutions:');
      console.error('1. Check internet connection');
      console.error('2. Verify cluster URL is correct');
      console.error('3. Check Network Access in MongoDB Atlas');
    } else if (error.message.includes('bad auth')) {
      console.error('\n🔑 Atlas Authentication Error:');
      console.error('1. This is a MongoDB Atlas specific error');
      console.error('2. Check your Atlas dashboard');
      console.error('3. Verify database user credentials');
      console.error('4. Make sure user has database permissions');
    }
    
    console.error('\n📖 For detailed setup help, see: ../MONGODB_SETUP.md');
    process.exit(1);
  });