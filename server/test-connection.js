#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB connection...\n');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  console.error('📋 Please copy .env.example to .env and configure it');
  process.exit(1);
}

console.log('🔗 Connection URI:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test basic operations
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('🏓 Database ping successful');
    
    // List collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('📚 Collections in database:', collections.length);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    console.log('\n🎉 Connection test completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Connection test failed:', err.message);
    
    if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check if MongoDB is running locally');
      console.error('   2. Verify the connection string in .env');
      console.error('   3. For Atlas: Check network access settings');
    } else if (err.message.includes('authentication failed')) {
      console.error('\n💡 Authentication issue:');
      console.error('   1. Check username/password in connection string');
      console.error('   2. Verify database user exists in Atlas');
    }
    
    console.error('\n📖 See MONGODB_SETUP.md for detailed setup instructions');
    process.exit(1);
  });