# Deployment Guide - Vercel

## Overview
This guide covers deploying the Career Guidance Platform to Vercel with both frontend and backend.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **MongoDB Atlas**: Set up a cloud MongoDB database
4. **Environment Variables**: Prepare all required env vars

## Deployment Options

### Option 1: Monorepo Deployment (Recommended)
Deploy both frontend and backend from the same repository.

### Option 2: Separate Deployments
Deploy frontend and backend as separate Vercel projects.

---

## Option 1: Monorepo Deployment

### Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select a region close to your users
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Read and write to any database"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Vercel's dynamic IPs

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `digital_guidance_platform`)

   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digital_guidance_platform?retryWrites=true&w=majority
   ```

### Step 2: Update Server Configuration

Update `server/index.js` to handle Vercel's serverless environment:

```javascript
// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/stream-quiz', require('./routes/streamQuiz'));
app.use('/api/field-quiz', require('./routes/fieldQuiz'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/courses', require('./routes/courses'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For Vercel serverless
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

### Step 3: Update Client Configuration

Create environment configuration for the client:

```javascript
// client/src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app/api'
    : 'http://localhost:5000/api');

export default API_BASE_URL;
```

Update all API calls to use this base URL:

```javascript
// Example: client/src/pages/quiz/StreamQuiz.js
import API_BASE_URL from '../../config/api';

// Replace hardcoded URLs
const response = await fetch(`${API_BASE_URL}/stream-quiz/random`);
```

### Step 4: Update package.json

Update root `package.json`:

```json
{
  "name": "career-guidance-platform",
  "version": "1.0.0",
  "scripts": {
    "install-all": "npm install && cd client && npm install && cd ../server && npm install",
    "build": "cd client && npm run build",
    "start": "node server/index.js",
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm start\"",
    "vercel-build": "cd client && npm install && npm run build"
  },
  "dependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### Step 5: Create Vercel Configuration

The `vercel.json` file is already created. Verify it:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ]
}
```

### Step 6: Deploy to Vercel

#### Via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd Career-Guidance
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - Project name? career-guidance-platform
   - In which directory is your code located? ./
   - Want to override settings? No

5. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV
   ```

   Or via Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Via Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
   - Install Command: `npm run install-all`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 7: Verify Deployment

1. **Check Backend**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Check Frontend**
   - Open `https://your-app.vercel.app` in browser
   - Test all features

3. **Check Database Connection**
   - Try logging in
   - Take a quiz
   - Verify data is saved

---

## Option 2: Separate Deployments

### Deploy Backend Separately

1. **Create `server/vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ]
   }
   ```

2. **Deploy Backend**
   ```bash
   cd server
   vercel --prod
   ```

3. **Note the backend URL** (e.g., `https://career-guidance-api.vercel.app`)

### Deploy Frontend Separately

1. **Update API URL in client**
   ```javascript
   // client/.env.production
   REACT_APP_API_URL=https://career-guidance-api.vercel.app/api
   ```

2. **Deploy Frontend**
   ```bash
   cd client
   vercel --prod
   ```

---

## Environment Variables Reference

### Required Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Environment
NODE_ENV=production

# Client URL (for CORS)
CLIENT_URL=https://your-app.vercel.app

# Port (optional, Vercel handles this)
PORT=5000
```

### Optional Variables

```bash
# Email (if using email features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# API Keys (if using external services)
OPENAI_API_KEY=sk-...
```

---

## Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Quiz functionality works
- [ ] Data persists to MongoDB
- [ ] All API endpoints respond
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Custom domain configured (optional)

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
2. Verify MONGODB_URI in Vercel environment variables
3. Check MongoDB Atlas user permissions

### Issue: "API calls failing with CORS error"

**Solution:**
1. Update CORS configuration in `server/index.js`:
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL || '*',
     credentials: true
   }));
   ```
2. Set CLIENT_URL environment variable in Vercel

### Issue: "Build fails"

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify build command is correct
4. Check for TypeScript/ESLint errors

### Issue: "Function timeout"

**Solution:**
1. Optimize database queries
2. Add indexes to MongoDB collections
3. Implement caching
4. Consider upgrading Vercel plan for longer timeouts

---

## Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   ```bash
   CLIENT_URL=https://yourdomain.com
   ```

3. **Update CORS**
   - Ensure your domain is allowed in CORS settings

---

## Monitoring and Maintenance

### View Logs
```bash
vercel logs
```

### View Deployments
```bash
vercel ls
```

### Rollback Deployment
```bash
vercel rollback
```

### Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and errors

---

## Performance Optimization

1. **Enable Caching**
   ```javascript
   // Add cache headers
   res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
   ```

2. **Optimize Images**
   - Use Next.js Image component or similar
   - Compress images before upload

3. **Code Splitting**
   - Already handled by Create React App
   - Verify in build output

4. **Database Indexing**
   ```javascript
   // Add indexes to frequently queried fields
   userSchema.index({ email: 1 });
   questionSchema.index({ stream: 1, field: 1 });
   ```

---

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use Vercel's environment variable management

2. **API Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations

4. **HTTPS Only**
   - Vercel provides HTTPS by default
   - Ensure all API calls use HTTPS

---

## Cost Considerations

### Vercel Free Tier Limits
- 100 GB bandwidth per month
- 100 hours serverless function execution
- Unlimited deployments

### MongoDB Atlas Free Tier
- 512 MB storage
- Shared RAM
- No backup

### Upgrade When Needed
- Monitor usage in dashboards
- Upgrade before hitting limits

---

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## Success! 🎉

Your Career Guidance Platform should now be live on Vercel!

**Next Steps:**
1. Test all functionality
2. Set up monitoring
3. Configure custom domain (optional)
4. Share with users!
