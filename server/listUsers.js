const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email createdAt').limit(5);
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log('Found users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, Created: ${user.createdAt}`);
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error listing users:', error);
    mongoose.connection.close();
  }
}

listUsers();