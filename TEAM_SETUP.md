# Team Setup Guide - No MongoDB Installation Required! 🎉

Your team lead has already set up a shared MongoDB database. You don't need to install MongoDB or create your own database!

## Quick Start (2 minutes)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-guidance-platform
   ```

2. **Run the automated setup**
   ```bash
   npm run setup
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

That's it! The setup script will automatically configure everything to use the shared team database.

## What's Included

✅ **Shared MongoDB Database** - No installation needed  
✅ **Pre-seeded Data** - Quiz questions, sample colleges, and courses  
✅ **Team JWT Secret** - Consistent authentication across the team  
✅ **Automatic Configuration** - Environment setup handled for you  

## Manual Setup (if needed)

If the automated setup doesn't work:

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Copy environment file**
   ```bash
   cp server/.env.example server/.env
   ```

3. **Test connection**
   ```bash
   # Windows PowerShell:
   cd server ; npm run test-connection
   
   # Or separately:
   cd server
   npm run test-connection
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Connection failed" error
- Check your internet connection
- The shared database might be temporarily unavailable
- Contact your team lead

### "Authentication failed" error
- Make sure you copied the `.env.example` correctly
- Don't modify the database credentials in `.env`

### Port already in use
- Another team member might be running the app
- Change the PORT in your `.env` file to a different number (e.g., 5001, 5002)

## Development Notes

- **Shared Database**: All team members use the same database
- **Data Persistence**: Your test data will be visible to other team members
- **User Accounts**: You can create test accounts - they'll be shared across the team
- **No Conflicts**: Multiple developers can run the app simultaneously on different ports

## Need Help?

1. Try the connection test: 
   ```bash
   # Windows PowerShell:
   cd server ; npm run test-connection
   
   # Or separately:
   cd server
   npm run test-connection
   ```
2. Check if you have the latest code: `git pull`
3. Ask in the team chat

## What You DON'T Need

❌ MongoDB installation  
❌ MongoDB Atlas account  
❌ Database setup  
❌ Environment configuration (it's automated)  
❌ Data seeding (already done)  

Just clone, setup, and code! 🚀