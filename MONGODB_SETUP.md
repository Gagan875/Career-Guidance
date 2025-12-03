# MongoDB Setup Guide

This guide helps team members set up MongoDB for the Career Guidance Platform.

## Option 1: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will typically install to `C:\Program Files\MongoDB\Server\{version}\bin`
4. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```
5. Verify installation by opening Command Prompt and running:
   ```cmd
   mongo --version
   ```

### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 2: MongoDB Atlas (Cloud - Recommended for Teams)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
   - Set username and password
5. Configure network access:
   - Go to Network Access
   - Add IP Address
   - For development, you can use `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Environment Setup

1. Copy the environment template:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit `server/.env` with your MongoDB configuration:

   **For Local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/digital_guidance_platform
   ```

   **For MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital_guidance_platform
   ```

3. Generate a secure JWT secret:
   ```bash
   # You can use this command to generate a random string
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## Database Initialization

After setting up MongoDB, initialize the database with sample data:

```bash
# Navigate to server directory
cd server

# Seed quiz questions (required for the quiz functionality)
npm run seed-questions

# Verify questions were added
npm run check-questions
```

## Troubleshooting

### Common Issues:

1. **Connection Error: `MongoNetworkError`**
   - Check if MongoDB service is running
   - Verify the connection string in `.env`
   - For Atlas: Check network access settings

2. **Authentication Failed**
   - Verify username/password in connection string
   - Check database user permissions in Atlas

3. **Database Not Found**
   - MongoDB will create the database automatically when first data is inserted
   - Make sure the database name in the connection string is correct

4. **Port Already in Use**
   - Default MongoDB port is 27017
   - Check if another MongoDB instance is running
   - You can change the port in the connection string if needed

### Verification Commands:

```bash
# Check if MongoDB is running (local installation)
# Windows:
tasklist /fi "imagename eq mongod.exe"

# macOS/Linux:
ps aux | grep mongod

# Test connection from Node.js
node -e "
const mongoose = require('mongoose');
mongoose.connect('your_mongodb_uri_here')
  .then(() => { console.log('✅ MongoDB connected successfully'); process.exit(0); })
  .catch(err => { console.error('❌ MongoDB connection failed:', err.message); process.exit(1); });
"
```

## Quick Start for Team Members

1. Choose MongoDB setup (local or Atlas)
2. Copy `.env.example` to `.env`
3. Update `MONGODB_URI` in `.env`
4. Run `npm run install-all` from project root
5. Run `cd server && npm run seed-questions`
6. Run `npm run dev` from project root

If you encounter any issues, check the troubleshooting section above or ask for help in the team chat.